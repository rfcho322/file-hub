import Image from "next/image";
import Link from "next/link";

export function Footer () {
    return (      
        <footer className="w-full px-8 bg-zinc-800">
            <div className="py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <Image src="/filehub_logo_no_bg.png" width={32} height={32} alt="FileHub Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">FileHub</span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-300 sm:mb-0">
                        <li>
                            <Link href="#" className="hover:underline me-4 md:me-6">About</Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:underline me-4 md:me-6">Licensing</Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:underline">Contact</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-neutral-500 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-300 sm:text-center">© 2024 <Link href="/" className="hover:underline">FileHub</Link>. All Rights Reserved.</span>
            </div>
        </footer>
    );
}