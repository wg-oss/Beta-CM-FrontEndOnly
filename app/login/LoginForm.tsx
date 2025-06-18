"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginPage from "../../components/LoginPage"

export default function LoginForm() {
  const router = useRouter()
  const [tempUsers, setTempUsers] = useState<any[]>([])

  const handleLogin = (user: {
    id: string
    role: "realtor" | "contractor"
    username?: string
    email?: string
    password?: string
  }) => {
    // Redirect based on role
    if (user.role === "realtor") {
      router.push("/realtor-dashboard")
    } else {
      router.push("/contractor-dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginPage 
          onLogin={handleLogin} 
          tempUsers={tempUsers} 
          setTempUsers={setTempUsers} 
        />
      </div>
    </div>
  )
}
