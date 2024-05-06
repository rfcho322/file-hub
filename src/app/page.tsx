"use client"
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { UploadButton } from "./UploadButton";
import { FileCard } from "./FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {
  const organization = useOrganization();
  // console.log(organization?.id);
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const files = useQuery(
    api.files.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-12">

      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <div className="text-2xl">Loading your files...</div>
        </div>
      )}

      {!isLoading && files.length === 0 && (
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
      )}

      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Files</h1>
            <UploadButton />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {files?.map(file => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>
        </>
      )}
    </main>
  );
}
