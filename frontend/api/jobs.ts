/** Create job (used by customer request service) */
import { getToken } from "./storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function createJob(payload: {
  customerId: string;
  title: string;
  description: string;
  category: string;
  address: string;
}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/job`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ?? "",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to create job");
  }
  return data;
}
