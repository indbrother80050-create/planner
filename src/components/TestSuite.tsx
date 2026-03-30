import React, { useState } from "react";
import { Play, RotateCcw, CheckCircle2, XCircle, Clock, Search, Filter } from "lucide-react";
import { TestResult } from "../types";
import { cn } from "../lib/utils";

const MOCK_TESTS: TestResult[] = [
  { id: "1", name: "User Authentication Flow", status: "PASSED", duration: 1240, timestamp: "2026-03-30 12:45:12" },
  { id: "2", name: "Payment Processing Integration", status: "FAILED", duration: 4500, timestamp: "2026-03-30 12:48:05", error: "Timeout: Gateway did not respond within 3000ms" },
  { id: "3", name: "Database Replication Sync", status: "PASSED", duration: 850, timestamp: "2026-03-30 12:50:22" },
  { id: "4", name: "API Rate Limiting Middleware", status: "PASSED", duration: 320, timestamp: "2026-03-30 12:52:15" },
  { id: "5", name: "Frontend Asset Optimization", status: "PENDING", duration: 0, timestamp: "2026-03-30 12:55:00" },
  { id: "6", name: "Security Headers Validation", status: "PASSED", duration: 150, timestamp: "2026-03-30 12:56:45" },
  { id: "7", name: "Email Notification Service", status: "FAILED", duration: 2100, timestamp: "2026-03-30 12:58:10", error: "SMTP Error: Connection refused" },
];

const TestSuite: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end border-b border-ink pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter uppercase">Automated Test Suite</h2>
          <p className="text-sm opacity-50 font-mono">End-to-end and integration test runner for production environments.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={runAllTests}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-2 px-6 py-2 bg-ink text-bg font-bold text-xs uppercase tracking-widest transition-all",
              isRunning ? "opacity-50 cursor-not-allowed" : "hover:bg-ink/80 active:scale-95"
            )}
          >
            {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Running Suite..." : "Run All Tests"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Test Summary */}
        <div className="space-y-6">
          <div className="p-6 border border-ink bg-bg">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 font-mono italic">Suite Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs uppercase font-bold">Total Tests</span>
                <span className="text-2xl font-bold mono">07</span>
              </div>
              <div className="flex justify-between items-end text-status-ok">
                <span className="text-xs uppercase font-bold">Passed</span>
                <span className="text-2xl font-bold mono">04</span>
              </div>
              <div className="flex justify-between items-end text-status-error">
                <span className="text-xs uppercase font-bold">Failed</span>
                <span className="text-2xl font-bold mono">02</span>
              </div>
              <div className="flex justify-between items-end opacity-50">
                <span className="text-xs uppercase font-bold">Pending</span>
                <span className="text-2xl font-bold mono">01</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-ink/10">
              <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                <span>Success Rate</span>
                <span>66.7%</span>
              </div>
              <div className="w-full h-1 bg-ink/10">
                <div className="h-full bg-ink" style={{ width: "66.7%" }} />
              </div>
            </div>
          </div>

          <div className="p-6 border border-ink bg-ink text-bg">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 font-mono italic">Last Run Info</h3>
            <p className="text-[10px] opacity-70 leading-relaxed mb-4">
              Suite executed by <span className="font-bold text-bg">GitHub Actions</span> (Workflow #421)
              at 2026-03-30 12:58:10 UTC.
            </p>
            <button className="text-[10px] font-bold uppercase underline">View Full Report</button>
          </div>
        </div>

        {/* Test List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
              <input 
                type="text" 
                placeholder="Filter tests..."
                className="w-full bg-transparent border border-ink p-2 pl-10 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>
            <button className="p-2 border border-ink hover:bg-ink hover:text-bg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="border border-ink divide-y divide-ink">
            <div className="grid grid-cols-6 p-4 bg-ink/5 col-header">
              <div className="col-span-3">Test Case</div>
              <div>Status</div>
              <div>Duration</div>
              <div className="text-right">Timestamp</div>
            </div>
            {MOCK_TESTS.map((test) => (
              <div key={test.id} className="data-row group p-4 text-sm">
                <div className="grid grid-cols-6 items-center">
                  <div className="col-span-3 font-bold">{test.name}</div>
                  <div className="flex items-center gap-2">
                    {test.status === "PASSED" && <CheckCircle2 className="w-3 h-3 text-status-ok" />}
                    {test.status === "FAILED" && <XCircle className="w-3 h-3 text-status-error" />}
                    {test.status === "PENDING" && <Clock className="w-3 h-3 opacity-30" />}
                    <span className={cn(
                      "text-[10px] font-bold mono uppercase",
                      test.status === "PASSED" ? "text-status-ok" : 
                      test.status === "FAILED" ? "text-status-error" : "opacity-30"
                    )}>
                      {test.status}
                    </span>
                  </div>
                  <div className="mono text-xs opacity-70">{test.duration > 0 ? `${test.duration}ms` : "--"}</div>
                  <div className="text-right mono text-[10px] opacity-50">{test.timestamp.split(" ")[1]}</div>
                </div>
                {test.error && (
                  <div className="mt-2 p-3 bg-status-error/10 border-l-2 border-status-error text-[10px] font-mono text-status-error">
                    {test.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSuite;
