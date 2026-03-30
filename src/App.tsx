/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TestSuite from "./components/TestSuite";
import Logs from "./components/Logs";
import { ShieldCheck, Settings } from "lucide-react";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "tests":
        return <TestSuite />;
      case "logs":
        return <Logs />;
      case "security":
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full space-y-4 animate-in zoom-in-95 duration-500">
            <ShieldCheck className="w-16 h-16 opacity-10" />
            <h2 className="text-2xl font-bold tracking-tighter uppercase">Security Audit</h2>
            <p className="text-sm opacity-50 font-mono">Security scanning and vulnerability assessment tools.</p>
            <div className="p-12 border border-dashed border-ink/20 bg-bg/50 text-center">
              <p className="text-xs font-bold uppercase tracking-widest opacity-30">Module Locked</p>
              <p className="text-[10px] opacity-30 mt-2">Requires Level 4 Clearance</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full space-y-4 animate-in zoom-in-95 duration-500">
            <Settings className="w-16 h-16 opacity-10" />
            <h2 className="text-2xl font-bold tracking-tighter uppercase">System Settings</h2>
            <p className="text-sm opacity-50 font-mono">Configure environment variables and system parameters.</p>
            <div className="p-12 border border-dashed border-ink/20 bg-bg/50 text-center">
              <p className="text-xs font-bold uppercase tracking-widest opacity-30">Module Locked</p>
              <p className="text-[10px] opacity-30 mt-2">Requires Level 4 Clearance</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bg text-ink selection:bg-ink selection:text-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Background Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#141414 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <div className="relative z-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;

