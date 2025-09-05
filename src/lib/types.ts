// Types for Python API integration
export interface PythonApiResponse {
  rushee: {
    name: string;
    email: string;
    phoneNumber?: string;
    major?: string;
  };
  availabilities: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

export interface RusheeData {
  name: string;
  email: string;
  phoneNumber?: string;
  major?: string;
}

export interface AvailabilityData {
  date: string;
  startTime: string;
  endTime: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface CreateRusheeResponse {
  rushee: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    major: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  availabilities: Array<{
    id: string;
    rusheeId: string;
    date: Date | null;
    startTime: Date | null;
    endTime: Date | null;
    interviewDateId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

// Interview scheduling types
export interface InterviewDate {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RusheeAvailability {
  id: string;
  rusheeId: string;
  interviewDateId: string | null;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAvailability {
  id: string;
  userId: string;
  interviewDateId: string | null;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewAssignment {
  id: string;
  rusheeId: string;
  interviewDateId: string;
  startTime: Date;
  endTime: Date;
  interviewer1Id: string;
  interviewer2Id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rushee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  major: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "member" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Extended types for scheduling with joined data
export interface RusheeAvailabilityExtended extends RusheeAvailability {
  rushee: Rushee | null;
}

export interface UserAvailabilityExtended extends UserAvailability {
  user: User | null;
}

export interface InterviewAssignmentExtended extends InterviewAssignment {
  rushee: Rushee | null;
  interviewer1: User | null;
  interviewer2: User | null;
}
