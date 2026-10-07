"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Overlays render in a portal, so they show the page's active theme (switch it at the top). */
export function InteractiveSamples() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => toast.success("জমা হয়েছে")}>
        Toast
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            Sheet
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>এখনও ঠিক আছে?</SheetTitle>
            <SheetDescription>দাম, সময় বা খাবারের তথ্য যাচাই করুন।</SheetDescription>
          </SheetHeader>
          <Button size="lg">জমা দিন</Button>
        </SheetContent>
      </Sheet>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>রিপোর্ট করবেন?</DialogTitle>
            <DialogDescription>আমরা তথ্যটি আবার দেখে নেব।</DialogDescription>
          </DialogHeader>
          <Button>রিপোর্ট করুন</Button>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>শেয়ার করুন</DropdownMenuItem>
          <DropdownMenuItem>সম্পাদনা প্রস্তাব</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">রিপোর্ট করুন</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
