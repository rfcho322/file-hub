"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileCardDropdownMenu } from "./FileDropdownMenu";

function UserColumn ({ userId } : { userId: Id<"users">}) {
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: userId,
    });
    return (
        <div className="flex items-center gap-2 text-xs text-gray-400 w-40">
            <Avatar className="w-6 h-6">
                <AvatarImage src={userProfile?.image} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {userProfile?.name}
        </div>
    );
}

export const columns: ColumnDef<Doc<"files"> & { isFavorited: boolean }>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "User",
    cell: ({ row }) => {
        return <UserColumn userId={row.original.userId} />
      },
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => {
        return (
            <div>{formatRelative(new Date(row.original._creationTime), new Date())}</div>
        );
      },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
        return (
            <div>
                <FileCardDropdownMenu isFavorited={row.original.isFavorited} file={row.original} />
            </div>
        );
      },
  },
]
