"use client"

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav () {
  const pathname = usePathname();

  return (
      <div className="w-40 flex flex-col gap-0">
        <Link href="/dashboard/files" 
          className={clsx("rounded-md", {
            "hover:bg-gray-200" : !pathname.includes("/dashboard/files"),
            "bg-blue-200" : pathname.includes("/dashboard/files"),
          })}>
          <Button 
            variant={"link"} 
            className="flex gap-2 !no-underline">
            <FileIcon /> Files
          </Button>
        </Link>
        <Link href="/dashboard/favorites" 
          className={clsx("rounded-md", {
            "hover:bg-gray-200" : !pathname.includes("/dashboard/favorites"),
            "bg-blue-200" : pathname.includes("/dashboard/favorites"),
          })}>
          <Button 
            variant={"link"} 
            className="flex gap-2 !no-underline">
            <StarIcon /> Favorites
          </Button>
        </Link>
      </div>
  );
} 