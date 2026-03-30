import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { CheckCircle2, AlertTriangle, XCircle, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Service, ServiceStatus, MetricPoint } from "../types";
import { cn } from "../lib/utils";

const MOCK_SERVICES: Service[] = [
  { id: "1", name: "Auth Service", status: ServiceStatus.OPERATIONAL, latency: 42, uptime: 99.99, lastChecked: "2m ago" },
  { id: "2", name: "Payment Gateway", status: ServiceStatus.DEGRADED, latency: 450, uptime: 98.4, lastChecked: "1m ago" },
  { id: "3", name: "User API", status: ServiceStatus.OPERATIONAL, latency: 120, uptime: 99.95, lastChecked: "30s ago" },
  { id: "4", name: "Database Cluster", status: ServiceStatus.OPERATIONAL, latency: 5, uptime: 100, lastChecked: "10s ago" },
  { id: "5", name: "CDN Edge", status: ServiceStatus.OUTAGE, latency: 0, uptime: 95.2, lastChecked: "Just now" },
];

const MOCK_METRICS: MetricPoint[] = [
  { time: "00:00", value: 400 },
  { time: "04:00", value: 300 },
  { time: "08:00", value: 600 },
  { time: "12:00", value: 800 },
  { time: "16:00", value: 500 },
  { time: "20:00", value: 900 },
  { time: "23:59", value: 700 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-ink pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter uppercase">System Overview</h2>
          <p className="text-sm opacity-50 font-mono">Real-time infrastructure health and performance metrics.</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase opacity-50 font-mono">Last Update</p>
          <p className="text-sm font-bold font-mono">2026-03-30 13:00:41 UTC</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Overall Uptime", value: "99.92%", change: "+0.02%", up: true },
          { label: "Avg. Latency", value: "142ms", change: "-12ms", up: true },
          { label: "Active Incidents", value: "01", change: "+1", up: false },
          { label: "Tests Passed", value: "1,242", change: "+42", up: true },
        ].map((stat, i) => (
          <div key={i} className="p-6 border border-ink bg-bg group hover:bg-ink hover:text-bg transition-all">
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2 font-mono">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold tracking-tighter mono">{stat.value}</h3>
              <div className={cn("flex items-center gap-1 text-[10px] font-bold mono", stat.up ? "text-status-ok" : "text-status-error")}>
                {stat.up ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs uppercase tracking-widest font-bold font-mono opacity-50 italic">Service Status</h3>
            <button className="text-[10px] uppercase font-bold hover:underline">View All Services</button>
          </div>
          <div className="border border-ink divide-y divide-ink">
            <div className="grid grid-cols-5 p-4 bg-ink/5 col-header">
              <div className="col-span-2">Service Name</div>
              <div>Status</div>
              <div>Latency</div>
              <div className="text-right">Uptime</div>
            </div>
            {MOCK_SERVICES.map((service) => (
              <div key={service.id} className="data-row grid grid-cols-5 p-4 items-center text-sm">
                <div className="col-span-2 font-bold">{service.name}</div>
                <div className="flex items-center gap-2">
                  {service.status === ServiceStatus.OPERATIONAL && <CheckCircle2 className="w-3 h-3 text-status-ok" />}
                  {service.status === ServiceStatus.DEGRADED && <AlertTriangle className="w-3 h-3 text-status-warn" />}
                  {service.status === ServiceStatus.OUTAGE && <XCircle className="w-3 h-3 text-status-error" />}
                  <span className="text-[10px] font-bold mono uppercase">{service.status}</span>
                </div>
                <div className="mono text-xs opacity-70">{service.latency}ms</div>
                <div className="text-right mono text-xs font-bold">{service.uptime}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latency Chart */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold font-mono opacity-50 italic">Network Throughput</h3>
          <div className="h-[300px] border border-ink p-4 bg-bg">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_METRICS}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#141414" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#141414' }} 
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '0', color: '#E4E3E0' }}
                  itemStyle={{ color: '#E4E3E0', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#141414" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 border border-ink bg-ink text-bg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-tighter">System Health Alert</span>
            </div>
            <p className="text-[10px] opacity-70 leading-relaxed">
              Payment Gateway is experiencing higher than normal latency in EU-WEST-1 region. 
              Engineering team is investigating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
