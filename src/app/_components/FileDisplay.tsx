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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";


function Placeholder() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <Image
        alt="an image of add a new file"
        width="350"
        height="350"
        src="/empty_files.svg"
      />
      <div className="text-2xl text-gray-100">
        Nothing to see here, try and upload a file nows
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
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const favorites = useQuery(api.files.getAllFavorites, 
    orgId ? { orgId } : "skip",
  );

  const files = useQuery(
    api.files.getFiles, orgId ? { orgId, type: type === "all" ? undefined : type, query, favorites: MyFavorites, deletedFiles } : "skip");
  const isLoading = files === undefined;

  const filesWithFavoritesData = files?.map(file => ({
    ...file,
    isFavorited: (favorites ?? []).some(
      (favorite) => favorite.fileId === file._id
    ),
  })) ?? [];

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-100">{title}</h1>
        <SearchBar query={query} setQuery={setQuery}/>
        <UploadButton/>
      </div>
      <Tabs defaultValue="grid">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Label htmlFor="typeSelect" className="text-gray-400">Type Filter</Label>
            <Select value={type} onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="typeSelect" 
                className="w-[180px] bg-neutral-800 text-gray-400 border-neutral-700 focus:ring-offset-gray-200">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-stone-600 text-gray-100">
                <SelectItem className="hover:!bg-neutral-700 hover:!text-gray-100" value="all">All</SelectItem>
                <SelectItem className="hover:!bg-neutral-700 hover:!text-gray-100" value="image">Image</SelectItem>
                <SelectItem className="hover:!bg-neutral-700 hover:!text-gray-100" value="csv">CSV</SelectItem>
                <SelectItem className="hover:!bg-neutral-700 hover:!text-gray-100" value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TabsList className="mb-4 bg-neutral-800">
            <TabsTrigger value="grid" className="flex gap-2 items-center text-gray-400">
              <LayoutGridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="flex gap-2 items-center text-gray-400">
              <AlignJustifyIcon />
              List
            </TabsTrigger>
          </TabsList>
        </div>
        {/* LOADER */}
        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-400" />
            <div className="text-2xl text-gray-100">Loading your files...</div>
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
