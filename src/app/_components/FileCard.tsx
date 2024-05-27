import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from "../../../convex/_generated/dataModel";
import { formatRelative } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import { FileCardDropdownMenu } from "./FileDropdownMenu";

export function FileCard({ file }: { file: Doc<"files"> & { isFavorited: boolean } & { url: string | null }}) {
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    });

    const typeIconsImage = (src : string, alt : string) => {
        return <Image src={src} alt={alt} width={24} height={24}></Image>;
    };

    const typesIcons = {
        image: typeIconsImage("/image-logo.png", "image logo"),
        pdf: typeIconsImage("/pdf-logo.png", "pdf logo"),
        csv: typeIconsImage("/csv-logo.png", "csv logo"),
    } as Record<Doc<"files">["type"], ReactNode>;
    
    return (
        <Card className="flex flex-col bg-neutral-800 border-stone-700">
            <CardHeader className="relative text-gray-100">
                <CardTitle className="flex gap-2 text-base">
                    <div className="flex justify-center">{typesIcons[file.type]}</div>
                    {file.name}
                    <div className="absolute top-3 right-3">
                        <FileCardDropdownMenu isFavorited={file.isFavorited} file={file} />
                    </div>
                </CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent className="flex-1 flex justify-center items-center">
                {
                    file.type === "image" && file.url && (
                    <div className="relative w-[250px] h-[250px]">
                        <Image 
                        src={file.url} alt={file.name} fill priority
                        sizes="(max-width: 300px) 100vw, 33vw"
                        className="rounded-md object-contain"/>
                    </div>
                )}
                {file.type === "csv" && <Image src="/csv-logo.png" alt="csv logo" priority width={80} height={80}/>}
                {/* {file.type === "pdf" && <FileText className="w-20 h-20"/>} */}
                {file.type === "pdf" && <Image src="/pdf-logo.png" alt="pdf logo" priority width={80} height={80}/>}
            </CardContent>
            <CardFooter className="flex justify-between mt-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 w-40">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={userProfile?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {userProfile?.name}
                </div>
                <div className="text-xs text-gray-400">
                    Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
                </div>
            </CardFooter>
        </Card>
    );

}