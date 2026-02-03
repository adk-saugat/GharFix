import { getToken } from "./storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type CustomerProfile = {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
};

export async function getCustomerProfile(): Promise<CustomerProfile> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: { Authorization: token ?? "" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Failed to load profile");
  return data.user as CustomerProfile;
}
