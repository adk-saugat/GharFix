/** Customer APIs: profile, my jobs, job applications, accept application */
import { getToken } from "./storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type { CustomerProfile } from "./types";
export type { JobApplicationItem } from "./types";
export type { JobItem } from "./types";

export async function getCustomerProfile() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: { Authorization: token ?? "" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load profile");
  }
  return data.user;
}

export async function getMyJobs(): Promise<import("./types").JobItem[]> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/jobs`, {
    headers: { Authorization: token ?? "" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load jobs");
  }
  return data.jobs ?? [];
}

export async function getJobApplications(
  jobId: string
): Promise<import("./types").JobApplicationItem[]> {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/job/${encodeURIComponent(jobId)}/applications`,
    { headers: { Authorization: token ?? "" } }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load applications");
  }
  return data.applications ?? [];
}

export async function acceptApplication(
  jobId: string,
  applicationId: string
): Promise<void> {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/job/${encodeURIComponent(jobId)}/application/${encodeURIComponent(applicationId)}/accept`,
    {
      method: "PUT",
      headers: { Authorization: token ?? "" },
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to accept application");
  }
}
