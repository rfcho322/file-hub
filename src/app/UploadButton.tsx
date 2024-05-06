"use client"
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation } from "convex/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";

const formSchema = z.object({
    title: z.string().min(2).max(200),
    file: z.custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, `Required`),
})

export function UploadButton() {
    const { toast } = useToast();
    const organization = useOrganization();
    // console.log(organization?.id);
    const user = useUser();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    });

    const fileRef = form.register("file");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        console.log(values.file);
        if (!orgId) return;

        const postUrl = await generateUploadUrl();

        const fileType = values.file[0].type;

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": fileType },
            body: values.file[0],
        });
        const { storageId } = await result.json();

        // console.log(values.file[0].type);
        const types = {
            "image/png": "image",
            "application/pdf": "pdf",
            "text/csv": "csv",
        } as Record<string, Doc<"files">["type"]>;

        try {
            createFile({
                name: values.title,
                fileId: storageId,
                orgId,
                type: types[fileType],
            });

            form.reset();

            setIsFileDialogOpen(false);

            toast({
                variant: "success",
                title: "File Upload Success",
                description: "Your file is ready to be access.",
            })
        } catch (err) {
            toast({
                variant: "destructive",
                title: "File Upload Success",
                description: "Your file cannot be uploaded, try again later",
            })
        }
    }

    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id
    }

    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

    const createFile = useMutation(api.files.createFile);

    return (

        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen);
            form.reset();
        }}
        >
            <DialogTrigger asChild>
                <Button
                    onClick={() => {
                        // console.log(orgId);
                        // if(!orgId) return;
                        // createFile({
                        //   name: "Hello World",
                        //   orgId
                        // });
                    }}
                >
                    File Upload
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-8">Upload your file</DialogTitle>
                    <DialogDescription>
                        This file will be accessible by anyone in your organization.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="file"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>File</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file" {...fileRef}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit"
                                disabled={form.formState.isSubmitting}
                                className="flex gap-1"
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
