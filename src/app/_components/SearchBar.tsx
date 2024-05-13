import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    query: z.string().min(0).max(200),
});


export function SearchBar({query, setQuery} : {query: string, setQuery: Dispatch<SetStateAction<string>>}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setQuery(values.query);
        console.log(values.query);
    }

    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center ">
                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Title</FormLabel> */}
                            <FormControl>
                                <Input placeholder="Search here..." {...field} className="w-96 bg-neutral-800 text-gray-400 border-neutral-700 focus:ring-offset-gray-200"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    size="sm" 
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex gap-1 bg-indigo-700 hover:bg-indigo-800"
                >
                    {form.formState.isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <SearchIcon className="h-5 w-5" /> Search
                </Button>
            </form>
        </Form>
    </div>
}