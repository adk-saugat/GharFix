export type CustomerProfile = {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
};

export type WorkerProfile = {
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

export type CreateJobPayload = {
  customerId: string;
  title: string;
  description: string;
  category: string;
  address: string;
};

export type JobApplicationItem = {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  proposedPrice: number;
  status: string;
  createdAt: string;
};

/** Worker's own application for a job (returned with GET job by worker). */
export type MyJobApplication = {
  id: string;
  jobId: string;
  workerId: string;
  proposedPrice: number;
  status: string;
  createdAt: string;
};

/** Job the worker has applied to (from GET /worker/jobs/applied). */
export type AppliedJobItem = Omit<JobItem, "customerId"> & {
  customerId?: string;
  applicationStatus: string;
  proposedPrice: number;
};

export type Message = {
  id: string;
  jobId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};
