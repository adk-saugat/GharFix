/** Customer APIs: profile, my jobs, job applications, accept application */
import { getToken } from "./storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type { CustomerProfile, JobApplicationItem, JobItem, Message } from "./types";

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

export async function getJobMessages(
  jobId: string
): Promise<import("./types").Message[]> {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/job/${encodeURIComponent(jobId)}/messages`,
    { headers: { Authorization: token ?? "" } }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load messages");
  }
  return data.messages ?? [];
}

export async function sendJobMessage(
  jobId: string,
  content: string
): Promise<import("./types").Message> {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/job/${encodeURIComponent(jobId)}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
      body: JSON.stringify({ content }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to send message");
  }
  return data.message;
}
