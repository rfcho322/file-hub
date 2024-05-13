import { SideNav } from "./SideNav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="pt-12 pb-12 bg-stone-900 min-h-screen">
      <div className="container p-8 mx-auto">
        <div className="flex gap-8">
          <SideNav />
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
