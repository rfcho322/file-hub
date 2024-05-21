"use client"

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav () {
  const pathname = usePathname();

  return (
      <div className="w-44 flex flex-col gap-1">
        <Link href="/dashboard/files" 
          className={clsx("rounded-xl p-2", {
            "hover:bg-neutral-800" : !pathname.includes("/dashboard/files"),
            "bg-neutral-800" : pathname.includes("/dashboard/files"),
          })}>
          <Button 
            variant={"link"} 
            className={clsx("flex gap-2 !no-underline font-bold text-gray-400",{
              "text-gray-200" : pathname.includes("/dashboard/files"),
            })}>
            <div className="bg-stone-900 px-3 py-2 rounded-xl border border-stone-700">
              <FileIcon className="text-white w-5 h-5"/>
            </div> 
             Files
          </Button>
        </Link>
        <Link href="/dashboard/favorites" 
          className={clsx("rounded-xl p-2", {
            "hover:bg-neutral-800" : !pathname.includes("/dashboard/favorites"),
            "bg-neutral-800" : pathname.includes("/dashboard/favorites"),
          })}>
          <Button 
            variant={"link"} 
            className={clsx("flex gap-2 !no-underline font-bold text-gray-400",{
              "text-gray-200" : pathname.includes("/dashboard/favorites"),
            })}>
            <div className="bg-stone-900 px-3 py-2 rounded-xl border border-stone-700">
              <StarIcon className="text-white w-5 h-5"/> 
            </div>
            Favorites
          </Button>
        </Link>

        <Link href="/dashboard/trash" 
          className={clsx("rounded-xl p-2", {
            "hover:bg-neutral-800" : !pathname.includes("/dashboard/trash"),
            "bg-neutral-800" : pathname.includes("/dashboard/trash"),
          })}>
          <Button 
            variant={"link"} 
            className={clsx("flex gap-2 !no-underline font-bold text-gray-400",{
              "text-gray-200" : pathname.includes("/dashboard/trash"),
            })}>
            <div className="bg-stone-900 px-3 py-2 rounded-xl border border-stone-700">
              <TrashIcon className="text-white w-5 h-5"/> 
            </div>
            Trash
          </Button>
        </Link>
      </div>
  );
} 