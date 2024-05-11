"use client"
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { UploadButton } from "./UploadButton";
import { FileCard } from "./FileCard";
import Image from "next/image";
import { AlignJustifyIcon, LayoutGridIcon, Loader2 } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { DataTable } from "./FileTable";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center">
      <Image
        alt="an image of add a new file"
        width="350"
        height="350"
        src="/empty_files.svg"
      />
      <div className="text-2xl">
        Nothing to see here, try and upload a file now
      </div>
      <UploadButton />
    </div>
  );
}

export function FilesDisplay({
  title, 
  MyFavorites,
  deletedFiles,
} : { 
  title: string; 
  MyFavorites?: boolean;
  deletedFiles?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const favorites = useQuery(api.files.getAllFavorites, 
    orgId ? { orgId } : "skip",
  );

  const files = useQuery(
    api.files.getFiles, orgId ? { orgId, query, favorites: MyFavorites, deletedFiles } : "skip");
  const isLoading = files === undefined;

  const filesWithFavoritesData = files?.map(file => ({
    ...file,
    isFavorited: (favorites ?? []).some(
      (favorite) => favorite.fileId === file._id
    ),
  })) ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
        <UploadButton />
      </div>
      <Tabs defaultValue="grid">
        <TabsList className="mb-4">
          <TabsTrigger value="grid" className="flex gap-2 items-center">
            <LayoutGridIcon />
            Grid
          </TabsTrigger>
          <TabsTrigger value="list" className="flex gap-2 items-center">
            <AlignJustifyIcon />
            List
          </TabsTrigger>
        </TabsList>
        {/* LOADER */}
        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your files...</div>
          </div>
        )}
        {/* GRID VIEW */}
        <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-4">
            {filesWithFavoritesData?.map(file => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>
        </TabsContent>
        {/* LIST VIEW */}
        <TabsContent value="list">
          {files && files?.length > 0 ? (
            <DataTable columns={columns} data={filesWithFavoritesData} />
          ) : null
          }
        </TabsContent>
      </Tabs>
      {/* NO FILES PLACEHOLDER */}
      {files?.length === 0 && <Placeholder /> }
    </div>
  );
}
