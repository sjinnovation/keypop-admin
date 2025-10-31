// import Sidebar from "@/components/Global/Sidebar";
// import Header from "@/components/Global/Header";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex h-screen bg-[#ffffff] overflow-hidden">
//         <Sidebar />
//         <Header />
//       <main className="flex-1 overflow-auto p-10">{children}</main>
//     </div>
//   );
// }

"use client";
import Sidebar from "@/components/Global/Sidebar";
import Header from "@/components/Global/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-[#ffffff] overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-10 pt-16">{children}</main>
      </div>
    </div>
  );
}
