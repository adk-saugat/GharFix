import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getToken, getUser } from "@/api/storage";
import { routes } from "@/utils/routes";

/**
 * Hook to redirect authenticated users away from public pages (home, login, register).
 * If user is authenticated, redirects to their appropriate dashboard.
 */
export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAndRedirect() {
      try {
        const token = await getToken();
        const user = await getUser();

        if (token && user) {
          // User is authenticated, redirect to their dashboard
          if (user.role === "customer") {
            router.replace(routes.customer.dashboard);
          } else if (user.role === "worker") {
            router.replace(routes.worker.dashboard);
          }
          return;
        }

        // User is not authenticated, allow access to public pages
        setIsChecking(false);
      } catch (error) {
        // On error, allow access (better UX than blocking)
        setIsChecking(false);
      }
    }

    checkAndRedirect();
  }, [router]);

  return { isChecking };
}
