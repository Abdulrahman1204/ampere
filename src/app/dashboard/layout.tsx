import AdminSidebar from "@/components/AdminSidebar";
import React from "react";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout =  async({ children }: AdminDashboardLayoutProps) => {
  const user = async () => {
    const token = (await cookies()).get("jwtToken")?.value || "";

    const user = verifyTokenForPage(token);

    return user;
  }

  const user_data = await user();
  const role = user_data?.role as string;
  return (
    <div className="flex w-[100%] min-h-screen">
      {/* Sidebar */}
      <div className="lg:w-64 z-40">
        <AdminSidebar role={role}/>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:mt-0">{children}</main>
    </div>
  );
};

export default DashboardLayout;
