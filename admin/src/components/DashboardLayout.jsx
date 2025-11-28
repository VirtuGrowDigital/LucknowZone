import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#f1f1f1] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">
        {children}
      </div>
    </div>
  );
}
