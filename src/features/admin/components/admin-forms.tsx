"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/i18n/client";

import { adminAct } from "../actions";

/** Merge this (duplicate) place into the place with the typed slug. */
export function MergeForm({ fromId }: { fromId: string }) {
  const t = useT();
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!slug.trim() || !window.confirm(t("admin.mergeConfirm"))) return;
    startTransition(async () => {
      const result = await adminAct({ kind: "merge", fromId, intoSlug: slug });
      if (result.ok) {
        toast.success(t("admin.done"));
        setSlug("");
        router.refresh();
      } else toast.error(t(`errors.${result.error.code}`));
    });
  }

  return (
    <form onSubmit={submit} className="mt-2 flex gap-2">
      <Input
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
        placeholder={t("admin.mergeInto")}
        aria-label={t("admin.mergeInto")}
        className="h-10"
      />
      <Button type="submit" size="sm" variant="soft" disabled={pending || !slug.trim()}>
        {t("admin.merge")}
      </Button>
    </form>
  );
}

/** Add or change a "famous for" entry: pick the district, type the food slug and a short note. */
export function FameForm({ districts }: { districts: { id: number; nameBn: string }[] }) {
  const t = useT();
  const router = useRouter();
  const [districtId, setDistrictId] = useState(districts[0]?.id ?? 1);
  const [foodSlug, setFoodSlug] = useState("");
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await adminAct({
        kind: "fame-set",
        districtId,
        foodSlug: foodSlug.trim(),
        noteBn: note.trim() || null,
      });
      if (result.ok) {
        toast.success(t("admin.done"));
        setFoodSlug("");
        setNote("");
        router.refresh();
      } else toast.error(t(`errors.${result.error.code}`));
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5">
      <select
        value={districtId}
        onChange={(event) => setDistrictId(Number(event.target.value))}
        aria-label={t("admin.fameDistrict")}
        className="h-11 rounded-card border border-border bg-card px-3 text-body"
      >
        {districts.map((district) => (
          <option key={district.id} value={district.id}>
            {district.nameBn}
          </option>
        ))}
      </select>
      <Input
        value={foodSlug}
        onChange={(event) => setFoodSlug(event.target.value)}
        placeholder={t("admin.fameFood")}
        aria-label={t("admin.fameFood")}
      />
      <Input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={t("admin.fameNote")}
        aria-label={t("admin.fameNote")}
      />
      <Button type="submit" disabled={pending || !foodSlug.trim()}>
        {t("admin.save")}
      </Button>
    </form>
  );
}
