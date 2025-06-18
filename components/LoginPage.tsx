"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Building2, Mail } from "lucide-react"

interface User {
  username: string
  email: string
  password: string
  role: "realtor" | "contractor"
  id: string
}

interface LoginPageProps {
  onLogin: (user: {
    id: string
    role: "realtor" | "contractor"
    username?: string
    email?: string
    password?: string
  }) => void
  tempUsers: User[]
  setTempUsers: React.Dispatch<React.SetStateAction<User[]>>
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, tempUsers, setTempUsers }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"realtor" | "contractor">("realtor")
  const [error, setError] = useState("")

  // Load saved users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("users")
    if (savedUsers) {
      setTempUsers(JSON.parse(savedUsers))
    }
  }, [])

  // Save users to localStorage whenever tempUsers changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(tempUsers))
  }, [tempUsers])

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("currentSession")
    if (savedSession) {
      const session = JSON.parse(savedSession)
      onLogin(session)
    }
  }, [])

  const credentials = {
    realtor: { username: "emma", password: "realtor123", id: "r1" },
    contractor: { username: "john", password: "contractor123", id: "c1" },
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (!username || !email || !password) {
        setError("All fields are required")
        return
      }

      // Check existing credentials first
      if (username === credentials.realtor.username || username === credentials.contractor.username) {
        setError("Username already exists")
        return
      }

      // Then check temp users
      const existingUser = tempUsers.find((user) => user.username === username || user.email === email)

      if (existingUser) {
        setError(existingUser.username === username ? "Username already exists" : "Email already exists")
        return
      }

      const newUser = {
        username,
        email,
        password,
        role,
        id: `${role === "realtor" ? "r" : "c"}${Date.now()}`,
      }

      setTempUsers((prev) => [...prev, newUser])

      // Save session
      const sessionData = {
        id: newUser.id,
        role: newUser.role,
        username: newUser.username,
        email: newUser.email,
      }
      localStorage.setItem("currentSession", JSON.stringify(sessionData))

      onLogin(newUser)
      return
    }

    // Login logic
    const tempUser = tempUsers.find((user) => user.username === username && user.password === password)
    if (tempUser) {
      // Save session
      const sessionData = {
        id: tempUser.id,
        role: tempUser.role,
        username: tempUser.username,
        email: tempUser.email,
      }
      localStorage.setItem("currentSession", JSON.stringify(sessionData))

      onLogin(tempUser)
      return
    }

    if (username === credentials.realtor.username && password === credentials.realtor.password) {
      const sessionData = {
        id: credentials.realtor.id,
        role: "realtor" as const,
        username: credentials.realtor.username,
      }
      localStorage.setItem("currentSession", JSON.stringify(sessionData))

      onLogin(sessionData)
    } else if (username === credentials.contractor.username && password === credentials.contractor.password) {
      const sessionData = {
        id: credentials.contractor.id,
        role: "contractor" as const,
        username: credentials.contractor.username,
      }
      localStorage.setItem("currentSession", JSON.stringify(sessionData))

      onLogin(sessionData)
    } else {
      setError("Invalid credentials")
    }
  }

  const resetForm = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ContractMatch</h1>
          <p className="text-gray-600">Connect with trusted professionals</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-center mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => {
                  setIsSignUp(false)
                  resetForm()
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  !isSignUp ? "bg-white shadow-sm" : "text-gray-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true)
                  resetForm()
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isSignUp ? "bg-white shadow-sm" : "text-gray-600"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("realtor")}
                    className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${
                      role === "realtor" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <Building2 size={18} />
                    Realtor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("contractor")}
                    className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${
                      role === "contractor"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <Building2 size={18} />
                    Contractor
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              {isSignUp ? (
                <>
                  <Building2 size={18} />
                  Create Account
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {!isSignUp && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Credentials</h2>

            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={18} className="text-blue-500" />
                  <h3 className="font-medium text-gray-900">Realtor Login</h3>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Username: emma</p>
                  <p>Password: realtor123</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={18} className="text-blue-500" />
                  <h3 className="font-medium text-gray-900">Contractor Login</h3>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Username: john</p>
                  <p>Password: contractor123</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage
