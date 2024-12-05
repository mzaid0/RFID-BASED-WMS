import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT Sidebar */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] h-full p-3 flex flex-col">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-4"
        >
          <Image src={"/login.png"} alt="logo" width={32} height={32} />
          <span className="hidden text-sm font-semibold lg:block uppercase">
            RFidWare
          </span>
        </Link>
        <Menu />
      </div>

      {/* RIGHT Content */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-y-auto bg-[#F7F8FA] flex flex-col ">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
