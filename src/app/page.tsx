"use client"
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";


export default function Home() {
  const organization = useOrganization();
  // console.log(organization?.id);
  const user  = useUser()

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const files = useQuery(
    api.files.getFiles, orgId ? {orgId} : "skip");
  // console.log(JSON.stringify(files));
  const createFile = useMutation(api.files.createFile);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {files?.map(file => {
        return <div key={file._id}>{file.name}</div>
      })}

      <Button 
        onClick={() => {
          // console.log(orgId);
          if(!orgId) return;
          createFile({
            name: "Hello World",
            orgId
          });
        }}
      >
        Click Me
      </Button>
    </main>
  );
}
