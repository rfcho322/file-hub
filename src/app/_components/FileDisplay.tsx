"use client"
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { UploadButton } from "./UploadButton";
import { FileCard } from "./FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useState } from "react";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
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

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <div className="text-2xl">Loading your files...</div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>
          {/* ADDED FOR TESTING */}
          {files.length === 0 && <Placeholder /> }

          <div className="grid grid-cols-3 gap-4">
            {files?.map(file => {
              return <FileCard favorites={favorites ?? []} key={file._id} file={file} />
            })}
          </div>
        </>
      )}
    </div>
  );
}
