/** Central place for app routes. Use with router.push() or router.replace(). */
export const routes = {
  home: "/" as const,
  login: "/login" as const,
  register: "/register" as const,
  customer: {
    dashboard: "/customer/dashboard" as const,
    myJobs: "/customer/myJobs" as const,
    requestService: "/customer/requestService" as const,
    profile: "/customer/profile" as const,
    job: (id: string) => `/customer/job/${id}` as const,
    jobChat: (id: string) => `/customer/job/${id}/chat` as const,
  },
  worker: {
    dashboard: "/worker/dashboard" as const,
    services: "/worker/services" as const,
    applied: "/worker/applied" as const,
    profile: "/worker/profile" as const,
    job: (id: string) => `/worker/job/${id}` as const,
    jobChat: (id: string) => `/worker/job/${id}/chat` as const,
  },
} as const;
