import { getToken } from "./storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function getWorkerProfile() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/worker/profile`, {
    headers: { Authorization: token ?? "" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Failed to load profile");
  return data.worker as {
    id: string;
    username: string;
    email: string;
    phone: string;
    skills: string[];
    hourlyRate: number;
    completedJobs: number;
    avgRating: number;
    verificationLevel: string;
    createdAt: string;
  };
}

export type JobItem = {
  id: string;
  customerId: string;
  username: string;
  phone: string;
  title: string;
  description: string;
  category: string;
  address: string;
  status: string;
  createdAt: string;
};

export async function getJobs(): Promise<JobItem[]> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/worker/jobs`, {
    headers: { Authorization: token ?? "" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Failed to load jobs");
  const list = data.jobs ?? [];
  return list.map((j: Record<string, unknown>) => ({
    id: String(j.id ?? ""),
    customerId: String(j.customerId ?? ""),
    username: String(j.username ?? ""),
    phone: String(j.phone ?? ""),
    title: String(j.title ?? ""),
    description: String(j.description ?? ""),
    category: String(j.category ?? ""),
    address: String(j.address ?? ""),
    status: String(j.status ?? "open"),
    createdAt: typeof j.createdAt === "string" ? j.createdAt : "",
  }));
}

export async function getJob(id: string): Promise<JobItem | null> {
  const jobs = await getJobs();
  return jobs.find((j) => j.id === id) ?? null;
}
