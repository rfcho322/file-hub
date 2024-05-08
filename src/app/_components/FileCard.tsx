import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileText, GanttChartSquare, ImageIcon, MoreVertical, StarIcon, TrashIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { getURL } from "next/dist/shared/lib/utils";


function FileCardDropdownMenu({ file }: { file: Doc<"files"> }) {
    const deleteFile = useMutation(api.files.deleteFile);
    const toggleFavorite = useMutation(api.files.toggleFavorite);
    const { toast } = useToast();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await deleteFile({
                                    fileId: file._id,
                                });
                                toast({
                                    variant: "default",
                                    title: "File Deleted",
                                    description: "Your file is successfully deleted.",
                                })
                            }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            toggleFavorite({
                                fileId: file._id,
                            });
                        }}
                        className="items-center cursor-pointer"
                    >
                        <StarIcon className="mr-2 h-4 w-4" /> Favorite
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsConfirmOpen(true)}
                        className="text-red-600 items-center cursor-pointer"
                    >
                        <TrashIcon className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

// function getFileUrl(fileId: Id<"_storage">): string {
//     // console.log(fileId);
//     return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
// }

export function FileCard({ file }: { file: Doc<"files"> & { url: string | null }}) {
    const typesIcons = {
        image: <ImageIcon />,
        pdf: <FileText />,
        csv: <GanttChartSquare />,
    } as Record<Doc<"files">["type"], ReactNode>;
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <div className="flex justify-center">{typesIcons[file.type]}</div>
                    {file.name}
                    <div className="absolute top-3 right-3">
                        <FileCardDropdownMenu file={file} />
                    </div>
                </CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
                {
                    file.type === "image" && file.url && (
                        <Image alt={file.name} width="200" height="200" src={file.url} />
                )}

                {file.type === "csv" && <GanttChartSquare className="w-20 h-20"/>}
                {file.type === "pdf" && <FileText className="w-20 h-20"/>}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button 
                    // OPENS A NEW TAB, PREVIEWS THE FILE, AND PROVIDES AN OPTION TO DOWNLOAD IT
                    onClick={() => {
                        if(!file.url) return;
                        window.open(file.url, "_blank");
                    }}
                >Download</Button>
            </CardFooter>
        </Card>
    );

}