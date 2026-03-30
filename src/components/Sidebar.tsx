import React from "react";
import { LayoutDashboard, Beaker, FileText, Settings, Activity, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tests", label: "Test Suite", icon: Beaker },
    { id: "logs", label: "System Logs", icon: FileText },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-ink h-screen flex flex-col bg-bg sticky top-0">
      <div className="p-6 border-b border-ink">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5" />
          <h1 className="font-bold text-lg tracking-tighter uppercase">Sentinel QA</h1>
        </div>
        <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono">v2.4.0-production</p>
      </div>
      
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors relative group",
              activeTab === item.id ? "bg-ink text-bg" : "hover:bg-ink/5"
            )}
          >
            <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-bg" : "text-ink")} />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-bg" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-ink">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink rounded-full flex items-center justify-center text-bg text-xs font-bold">
            QA
          </div>
          <div>
            <p className="text-xs font-bold">Admin User</p>
            <p className="text-[10px] opacity-50 uppercase">Lead Engineer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
