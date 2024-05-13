"use client"

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav () {
  const pathname = usePathname();

  return (
      <div className="w-40 flex flex-col gap-0">
        <Link href="/dashboard/files" 
          className={clsx("rounded-md", {
            "hover:bg-neutral-800" : !pathname.includes("/dashboard/files"),
            "bg-neutral-800" : pathname.includes("/dashboard/files"),
          })}>
          <Button 
            variant={"link"} 
            className={clsx("flex gap-2 !no-underline text-gray-400",{
              "text-gray-200" : pathname.includes("/dashboard/files"),
            })}>
            <FileIcon /> Files
          </Button>
        </Link>
        <Link href="/dashboard/favorites" 
          className={clsx("rounded-md", {
            "hover:bg-neutral-800" : !pathname.includes("/dashboard/favorites"),
            "bg-neutral-800" : pathname.includes("/dashboard/favorites"),
          })}>
          <Button 
            variant={"link"} 
            className={clsx("flex gap-2 !no-underline text-gray-400",{
              "text-gray-200" : pathname.includes("/dashboard/favorites"),
            })}>
            <StarIcon /> Favorites
          </Button>
        </Link>

        <Link href="/dashboard/trash" 
          className={clsx("rounded-md", {
            "hover:bg-neutral-800" : !pathname.includes("/dashboard/trash"),
            "bg-neutral-800" : pathname.includes("/dashboard/trash"),
          })}>
          <Button 
            variant={"link"} 
            className={clsx("flex gap-2 !no-underline text-gray-400",{
              "text-gray-200" : pathname.includes("/dashboard/trash"),
            })}>
            <TrashIcon /> Trash
          </Button>
        </Link>
      </div>
  );
} 