import { getServices } from "@/infrastructure/container";

import { SaveButton } from "./save-button";

/** Reads the visitor's session to know if this is already saved, so it must sit inside Suspense. */
export async function SaveControl({
  entity,
  entityId,
}: {
  entity: "food" | "place";
  entityId: string;
}) {
  const { auth, saved } = getServices();
  const session = await auth.getSession();
  const initialSaved = session ? await saved.isSaved(session.user.id, { entity, entityId }) : false;
  return <SaveButton entity={entity} entityId={entityId} initialSaved={initialSaved} />;
}
