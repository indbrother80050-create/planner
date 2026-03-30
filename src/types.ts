export enum ServiceStatus {
  OPERATIONAL = "OPERATIONAL",
  DEGRADED = "DEGRADED",
  OUTAGE = "OUTAGE",
  MAINTENANCE = "MAINTENANCE",
}

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  latency: number;
  uptime: number;
  lastChecked: string;
}

export interface TestResult {
  id: string;
  name: string;
  status: "PASSED" | "FAILED" | "PENDING";
  duration: number;
  timestamp: string;
  error?: string;
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
  service: string;
}
