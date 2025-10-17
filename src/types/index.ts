import { DefaultSession } from "next-auth"

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

// Repository types
export interface Repository {
  id: string
  userId: string
  githubId: number
  name: string
  fullName: string
  description: string | null
  url: string
  language: string | null
  isPrivate: boolean
  isActive: boolean
  lastSync: Date | null
  createdAt: Date
  updatedAt: Date
}

// Document types
export interface Document {
  id: string
  repositoryId: string
  filePath: string
  fileName: string
  content: string
  summary: string | null
  language: string | null
  type: string
  createdAt: Date
  updatedAt: Date
}

// GitHub API types
export interface GitHubRepo {
  id: number
  name: string
  fullName: string
  description: string | null
  url: string
  language: string | null
  isPrivate: boolean
  updatedAt: string
}

export interface GitHubCommit {
  sha: string
  message: string
  author: string | undefined
  date: string | undefined
  url: string
}

export interface GitHubFile {
  filename: string
  status: string
  additions: number
  deletions: number
  changes: number
  patch?: string
}

// API Response types
export interface ApiResponse<T = any > {
  success: boolean
  data?: T
  error?: string
}