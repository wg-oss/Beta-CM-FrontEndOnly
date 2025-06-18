export interface User {
  id: string
  name: string
  email: string
  photo?: string
  role: "realtor" | "contractor"
  company?: string
  bio?: string
  yearsExperience: number
  connections: Connection[]
}

export interface Realtor extends User {
  role: "realtor"
  specialties: string[]
}

export interface Contractor extends User {
  role: "contractor"
  specialty: string
  certifications: string[]
  portfolio: PortfolioItem[]
  rating: number
  generalReviews: Review[]
  availability: Availability
  pendingMeetings: MeetingRequest[]
}

export interface Connection {
  id: string
  connectionId: string
  status: "pending" | "accepted" | "declined"
  createdAt: string
  workHistory?: {
    relationship: "colleague" | "worked-together"
    companyName: string
  }
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  completionDate: string
  clientFeedback?: string
}

export interface Review {
  reviewer: string
  rating: number
  content: string
  date: string
  mutual?: boolean
}

export interface Availability {
  workingHours: {
    start: string
    end: string
  }
  workingDays: number[]
  meetingDuration: number
  bookedSlots: BookedSlot[]
}

export interface BookedSlot {
  date: string
  startTime: string
  endTime: string
  realtorId: string
  status: "confirmed" | "pending"
  notes?: string
}

export interface MeetingRequest {
  id: string
  date: string
  startTime: string
  endTime: string
  realtorId: string
  status: "pending" | "accepted" | "declined"
  notes: string
}

export interface Post {
  id: string
  userId: string
  content: string
  images: string[]
  projectId?: string
  likes: string[]
  comments: Comment[]
  createdAt: string
  type: "project-update" | "certification" | "general" | "project-showcase" | "work-anniversary"
}

export interface Comment {
  id: string
  userId: string
  content: string
  createdAt: string
}
