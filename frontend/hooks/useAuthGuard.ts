import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getToken, getUser } from "@/api/storage";
import { routes } from "@/utils/routes";

/**
 * Hook to verify authentication token and role on protected pages.
 * @param requiredRole - Optional role requirement ("customer" or "worker"). If provided, redirects to appropriate dashboard if role doesn't match.
 * Redirects to login if token is missing or invalid.
 */
export function useAuthGuard(requiredRole?: "customer" | "worker") {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getToken();
        const user = await getUser();

        if (!token || !user) {
          router.replace(routes.login);
          return;
        }

        // Check role if required
        if (requiredRole && user.role !== requiredRole) {
          // Redirect to the correct dashboard based on user's actual role
          if (user.role === "customer") {
            router.replace(routes.customer.dashboard);
          } else if (user.role === "worker") {
            router.replace(routes.worker.dashboard);
          } else {
            // Unknown role, go to login
            router.replace(routes.login);
          }
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        router.replace(routes.login);
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [router, requiredRole]);

  return { isChecking, isAuthenticated };
}
