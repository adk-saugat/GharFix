import { getToken } from "./storage";

const BASE_URL = "http://172.20.10.5:8080";

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
  return data.jobs ?? [];
}
