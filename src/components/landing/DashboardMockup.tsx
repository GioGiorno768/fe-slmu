// Server Component - No "use client" for SEO
import Image from "next/image";
import DashboardMockupClient from "./DashboardMockupClient";

export default function DashboardMockup() {
  return (
    <DashboardMockupClient>
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-100">
        {/* Browser Top Bar */}
        <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
          <div className="flex gap-2">
            <div className="size-3 rounded-full bg-red-400/80"></div>
            <div className="size-3 rounded-full bg-amber-400/80"></div>
            <div className="size-3 rounded-full bg-green-400/80"></div>
          </div>
          <div className="ml-4 flex-1 max-w-xl">
            <div className="h-6 bg-white rounded-md border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 select-none">
              shortlinkmu.com/dashboard/analytics
            </div>
          </div>
        </div>

        {/* Dashboard Screenshot */}
        <div className="relative w-full">
          <Image
            src="/landing/dashboard.webp"
            alt="Shortlinkmu Dashboard Preview - Analytics, Earnings, and Links Management"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
            quality={90}
          />
        </div>
      </div>
    </DashboardMockupClient>
  );
}
