import React, { useState } from "react";
import { Terminal, Search, Download, Trash2, AlertCircle, Info, AlertTriangle, Sparkles, X } from "lucide-react";
import { LogEntry } from "../types";
import { cn } from "../lib/utils";
import { analyzeLogs } from "../lib/gemini";
import { motion, AnimatePresence } from "motion/react";

const MOCK_LOGS: LogEntry[] = [
  { id: "1", timestamp: "13:00:41.242", level: "INFO", message: "User authentication successful for user_id: 421", service: "Auth Service" },
  { id: "2", timestamp: "13:00:40.850", level: "ERROR", message: "Database connection timeout in pool: main-cluster", service: "Database" },
  { id: "3", timestamp: "13:00:39.120", level: "WARN", message: "Slow query detected: SELECT * FROM transactions WHERE status = 'pending'", service: "Payment Gateway" },
  { id: "4", timestamp: "13:00:38.450", level: "INFO", message: "Cache invalidated for key: user_profile_421", service: "User API" },
  { id: "5", timestamp: "13:00:37.900", level: "INFO", message: "New deployment detected: v2.4.0-production", service: "System" },
  { id: "6", timestamp: "13:00:36.500", level: "ERROR", message: "Failed to send email notification to: user@example.com", service: "Notification" },
  { id: "7", timestamp: "13:00:35.200", level: "INFO", message: "Health check passed for all services", service: "Monitor" },
  { id: "8", timestamp: "13:00:34.100", level: "WARN", message: "CPU usage exceeded 80% on node: worker-01", service: "Infrastructure" },
];

const Logs: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeLogs(MOCK_LOGS);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-end border-b border-ink pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter uppercase">System Logs</h2>
          <p className="text-sm opacity-50 font-mono">Aggregated logs from all microservices and infrastructure nodes.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={cn(
              "flex items-center gap-2 px-4 py-2 bg-ink text-bg font-bold text-xs uppercase tracking-widest transition-all hover:bg-ink/80 disabled:opacity-50",
              isAnalyzing && "animate-pulse"
            )}
          >
            <Sparkles className={cn("w-4 h-4", isAnalyzing && "animate-spin")} />
            {isAnalyzing ? "Analyzing..." : "AI Analysis"}
          </button>
          <button className="p-2 border border-ink hover:bg-ink hover:text-bg transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 bg-ink text-bg border border-ink relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-status-warn animate-pulse" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-status-warn" />
                <h3 className="text-xs font-bold uppercase tracking-widest italic">SRE AI Report</h3>
              </div>
              <button onClick={() => setAnalysis(null)} className="hover:text-status-error">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[11px] font-mono leading-relaxed prose prose-invert max-w-none">
              {analysis.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Log Controls */}
        <div className="flex items-center gap-4 bg-bg p-4 border border-ink">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
            <input 
              type="text" 
              placeholder="Search logs (e.g. service:auth level:error)..."
              className="w-full bg-transparent border-none p-1 pl-10 text-xs font-mono focus:outline-none"
            />
          </div>
          <div className="flex gap-2 border-l border-ink pl-4">
            {["INFO", "WARN", "ERROR"].map((level) => (
              <button 
                key={level}
                className={cn(
                  "px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-ink transition-all",
                  level === "ERROR" ? "bg-status-error text-bg border-status-error" : "hover:bg-ink hover:text-bg"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Log View */}
        <div className="bg-ink text-bg font-mono text-[11px] p-6 border border-ink shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-6 bg-bg/10 flex items-center px-4 gap-2">
            <div className="w-2 h-2 rounded-full bg-status-error/50" />
            <div className="w-2 h-2 rounded-full bg-status-warn/50" />
            <div className="w-2 h-2 rounded-full bg-status-ok/50" />
            <span className="ml-2 text-[9px] uppercase tracking-widest opacity-50">terminal_output.log</span>
          </div>
          
          <div className="space-y-2 mt-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {MOCK_LOGS.map((log) => (
              <div key={log.id} className="flex gap-4 group hover:bg-bg/5 p-1 -mx-1 transition-colors">
                <span className="opacity-30 shrink-0">{log.timestamp}</span>
                <span className={cn(
                  "font-bold shrink-0 w-12",
                  log.level === "INFO" ? "text-status-ok" : 
                  log.level === "WARN" ? "text-status-warn" : "text-status-error"
                )}>
                  [{log.level}]
                </span>
                <span className="opacity-50 shrink-0 w-32 truncate italic">[{log.service}]</span>
                <span className="leading-relaxed">{log.message}</span>
              </div>
            ))}
            <div className="flex gap-4 animate-pulse">
              <span className="opacity-30">13:00:42.105</span>
              <span className="text-status-ok font-bold">[INFO]</span>
              <span className="opacity-50">[System]</span>
              <span className="flex gap-1">
                Awaiting next event<span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
