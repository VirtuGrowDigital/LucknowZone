import Sidebar from "./Sidebar";
import bgadmin from "../assets/Images/bgadmin.png";

export default function DashboardLayout({ children }) {
  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${bgadmin})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Sidebar />

      <div className="flex-1 p-2 bg-black/20 backdrop-blur-sm min-h-screen">
        {children}
      </div>
    </div>
  );
}
