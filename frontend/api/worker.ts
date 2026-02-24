/** Worker APIs: profile, jobs, apply, add profile */
import { getToken } from "./storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type {
  JobItem,
  WorkerProfile,
  MyJobApplication,
  AppliedJobItem,
  Message,
} from "./types";

export async function getWorkerProfile() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/worker/profile`, {
    headers: { Authorization: token ?? "" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load profile");
  }
  return data.worker;
}

export async function getJobs() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/worker/jobs`, {
    headers: { Authorization: token ?? "" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load jobs");
  }
  return data.jobs ?? [];
}

export async function getAppliedJobs(): Promise<
  import("./types").AppliedJobItem[]
> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/worker/jobs/applied`, {
    headers: { Authorization: token ?? "" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load applied jobs");
  }
  return data.jobs ?? [];
}

export type JobDetailResponse = {
  job: import("./types").JobItem | null;
  myApplication: import("./types").MyJobApplication | null;
};

export async function getJob(id: string): Promise<JobDetailResponse> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/worker/jobs/${encodeURIComponent(id)}`, {
    headers: { Authorization: token ?? "" },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 404) {
    return { job: null, myApplication: null };
  }
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load job");
  }
  return {
    job: data.job ?? null,
    myApplication: data.myApplication ?? null,
  };
}

export type AddWorkerProfilePayload = {
  userId: string;
  skills: string[];
  hourlyRate: number;
};

export async function addWorkerProfile(payload: AddWorkerProfilePayload) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/worker/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ?? "",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to create worker profile");
  }
  return data;
}

export async function markJobComplete(jobId: string) {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/worker/jobs/${encodeURIComponent(jobId)}/complete`,
    {
      method: "PUT",
      headers: { Authorization: token ?? "" },
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to mark job complete.");
  }
  return data;
}

export async function applyForJob(jobId: string, proposedPrice: number) {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/worker/jobs/${encodeURIComponent(jobId)}/apply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
      body: JSON.stringify({ proposedPrice }),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to submit application");
  }
  return data;
}

export async function getJobMessages(
  jobId: string
): Promise<import("./types").Message[]> {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/worker/jobs/${encodeURIComponent(jobId)}/messages`,
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
    `${BASE_URL}/worker/jobs/${encodeURIComponent(jobId)}/messages`,
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
