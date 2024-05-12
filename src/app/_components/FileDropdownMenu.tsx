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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DownloadIcon, FileText, GanttChartSquare, HistoryIcon, ImageIcon, MoreVertical, StarIcon, TrashIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";


export function FileCardDropdownMenu({ file, isFavorited }: { file: Doc<"files"> & { url?: string | null }, isFavorited: boolean }) {
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const toggleFavorite = useMutation(api.files.toggleFavorite);
    const { toast } = useToast();
    const authUser = useQuery(api.users.getAuthUser);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            File moved to trash can be permanently deleted. Please ensure that you no longer need this file before proceeding.
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
                                    title: "File moved to trash",
                                    description: "Your file has been successfully moved to the trash folder",
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
                            if(!file.url) return;
                            window.open(file.url, "_blank");
                        }}
                        className="items-center cursor-pointer"
                    >   
                        <DownloadIcon className="mr-2 h-4 w-4" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            toggleFavorite({
                                fileId: file._id,
                            });
                        }}
                        className="items-center cursor-pointer"
                    >   
                        { isFavorited ? (
                            <div className="flex items-center">
                                <StarIcon className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                                Remove as Favorite
                            </div>
                        ) :
                            <div className="flex items-center">
                                <StarIcon className="mr-2 h-4 w-4" /> Add to Favorites
                            </div>
                        }
                    </DropdownMenuItem>
                    <Protect
                        condition={(checkRole) => {
                            return checkRole({
                                role: "org:admin",
                            }) || file.userId === authUser?._id;
                        }}
                        fallback={<></>}
                    >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                if (file.toBeDeleted) {
                                    restoreFile({
                                        fileId: file._id,
                                    });
                                } else {
                                    setIsConfirmOpen(true)
                                }
                            }}
                            className="cursor-pointer"
                        >
                            {file.toBeDeleted ?
                                <div className="flex items-center">
                                    <HistoryIcon className="mr-2 h-4 w-4" /> Restore
                                </div> 
                            :
                                <div className="flex items-center text-red-600">
                                    <TrashIcon className="mr-2 h-4 w-4" /> Delete
                                </div> 
                            }
                        </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export function FileCard({ file, favorites }: { file: Doc<"files"> & { url: string | null }, favorites: Doc<"favorites">[]}) {
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    });
    const typesIcons = {
        image: <ImageIcon />,
        pdf: <FileText />,
        csv: <GanttChartSquare />,
    } as Record<Doc<"files">["type"], ReactNode>;
    
    const  isFavorited = favorites.some(favorite => favorite.fileId === file._id);
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 text-base">
                    <div className="flex justify-center">{typesIcons[file.type]}</div>
                    {file.name}
                    <div className="absolute top-3 right-3">
                        <FileCardDropdownMenu isFavorited={isFavorited} file={file} />
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
            <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-600 w-40">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={userProfile?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {userProfile?.name}
                </div>
                <div className="text-xs text-gray-600">
                    Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
                </div>
            </CardFooter>
        </Card>
    );

}