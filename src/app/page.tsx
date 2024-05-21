import { Button } from "@/components/ui/button";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";

export default function LandingPage() {

    return (
        <div className="bg-stone-900">
            <div className="relative isolate px-6 lg:px-8">
                <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
                >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                    clipPath:
                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-300 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                        Announcing our next round of funding.{' '}
                        <a href="#" className="font-semibold text-indigo-500">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Read more <span aria-hidden="true">&rarr;</span>
                        </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold p-2 tracking-tight sm:text-6xl bg-gradient-to-r from-blue-400 to-blue-900 text-transparent bg-clip-text">
                            Elevate Your Data Storage Experience
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                        Your One-Stop Solution for Secure File Management and Collaboration. Upload, Share, and Manage Files Effortlessly.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                        <SignedOut>
                            <a
                                href="/dashboard/files"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get Started
                            </a>
                        </SignedOut>
                        <SignedIn>
                            <a
                                href="/dashboard/files"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Go to Dashboard
                            </a>
                        </SignedIn>
                        <a href="#" className="text-sm font-semibold leading-6 text-white">
                            Learn more <span aria-hidden="true">→</span>
                        </a>
                        </div>
                    </div>
                
                </div>
                {/* LOGOS */}
                <div className="bg-gray-200 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
                    Trusted by the world’s most innovative teams
                    </h2>
                    <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                    <Image
                        className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src="/company-logo1.svg"
                        alt="company logo 1"
                        width={158}
                        height={48}
                    />
                    <Image
                        className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src="/company-logo2.svg"
                        alt="company logo 2"
                        width={158}
                        height={48}
                    />
                    <Image
                        className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src="/company-logo3.svg"
                        alt="company logo 3"
                        width={158}
                        height={48}
                    />
                    <Image
                        className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
                        src="/company-logo4.svg"
                        alt="company logo 4"
                        width={158}
                        height={48}
                    />
                    <Image
                        className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                        src="/company-logo5.svg"
                        alt="company logo 5"
                        width={158}
                        height={48}
                    />
                    </div>
                </div>
                </div>
                {/* END OF LOGOS */}
                {/* CTA */}
                <div className="mx-auto py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="relative isolate overflow-hidden bg-stone-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                    <svg
                        viewBox="0 0 1024 1024"
                        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                        aria-hidden="true"
                    >
                        <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                        <defs>
                        <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                            <stop stopColor="#7775D6" />
                            <stop offset={1} stopColor="#E935C1" />
                        </radialGradient>
                        </defs>
                    </svg>
                    <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Transform Your File Management Journey
                        <br />
                        Start using our app today.
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                        Experience Seamless File Management and Collaboration Today. Join FileHub and Streamline Your Workflow.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                        <SignedOut>
                            <SignUpButton >
                                <Button className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                Sign Up
                                </Button>
                            </SignUpButton>
                        </SignedOut>
                        <a href="#" className="text-sm font-semibold leading-6 text-white">
                            Learn more <span aria-hidden="true">→</span>
                        </a>
                        </div>
                    </div>
                    <div className="relative mt-8 h-80 lg:mt-8">
                        <Image
                        className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                        src="/cta-image.jpg"
                        alt="App screenshot"
                        width={1824}
                        height={1080}
                        />
                    </div>
                    </div>
                </div>
                {/* END OF CTA */}
                <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
                >
                {/* sm:w-[72.1875rem] */}
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)]"
                    style={{
                    clipPath:
                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
                </div>
            </div>
        </div>
    )
}
