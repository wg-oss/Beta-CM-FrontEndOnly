import type { User, Post, Comment } from "../types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// API endpoints
const endpoints = {
  users: `${API_BASE_URL}/users`,
  posts: `${API_BASE_URL}/posts`,
  comments: `${API_BASE_URL}/comments`,
  connections: `${API_BASE_URL}/connections`,
}

// Generic fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// User API
export const userAPI = {
  getCurrentUser: () => fetchAPI<User>(`${endpoints.users}/me`),
  getUser: (id: string) => fetchAPI<User>(`${endpoints.users}/${id}`),
  updateUser: (id: string, data: Partial<User>) =>
    fetchAPI<User>(`${endpoints.users}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
}

// Posts API
export const postAPI = {
  getPosts: () => fetchAPI<Post[]>(endpoints.posts),
  getPost: (id: string) => fetchAPI<Post>(`${endpoints.posts}/${id}`),
  createPost: (data: Omit<Post, "id" | "createdAt">) =>
    fetchAPI<Post>(endpoints.posts, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePost: (id: string, data: Partial<Post>) =>
    fetchAPI<Post>(`${endpoints.posts}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deletePost: (id: string) =>
    fetchAPI<void>(`${endpoints.posts}/${id}`, {
      method: "DELETE",
    }),
}

// Comments API
export const commentAPI = {
  getComments: (postId: string) => fetchAPI<Comment[]>(`${endpoints.comments}?postId=${postId}`),
  createComment: (data: Omit<Comment, "id" | "createdAt">) =>
    fetchAPI<Comment>(endpoints.comments, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateComment: (id: string, data: Partial<Comment>) =>
    fetchAPI<Comment>(`${endpoints.comments}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteComment: (id: string) =>
    fetchAPI<void>(`${endpoints.comments}/${id}`, {
      method: "DELETE",
    }),
}

// Connections API
export const connectionAPI = {
  getConnections: () => fetchAPI<{ id: string; status: string }[]>(endpoints.connections),
  createConnection: (userId: string) =>
    fetchAPI<{ id: string; status: string }>(endpoints.connections, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),
  updateConnection: (id: string, status: "accepted" | "declined") =>
    fetchAPI<{ id: string; status: string }>(`${endpoints.connections}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
} 