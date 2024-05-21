"use client"
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {

    const pathname = usePathname()
    
    return (
        <div className="sticky top-0 z-10 border-b border-b-stone-700 py-4 bg-zinc-800">
            <div className="items-center container mx-auto justify-between flex">
                <Link href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <Image src="/filehub_logo_no_bg.png" width={32} height={32} alt="FileHub Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">FileHub</span>
                </Link>
                <div className="flex gap-2 items-center">
                    { 
                        pathname.includes("/dashboard/") ? null : 
                        <SignedIn>    
                            <Link href="/dashboard/files">
                                <Button
                                    variant={"link"} 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white !no-underline">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </SignedIn>
                    }
                    <div className="flex gap-2">
                        <OrganizationSwitcher />
                        <UserButton />
                        <SignedOut>    
                            <SignInButton>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Sign In</Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </div>
    );
}