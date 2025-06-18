"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  photoURL: string
  location: string
  about: string
  specialties: string[]
  connections: string[]
  pendingSent: string[]
  pendingReceived: string[]
}

export default function ContractorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login")
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "contractors", firebaseUser.uid))
        if (!userDoc.exists()) {
          router.push("/login")
          return
        }

        setUser(userDoc.data() as User)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.photoURL || "https://www.gravatar.com/avatar?d=mp&s=200"}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600">{user.location}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Specialties Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {user.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Connections Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connections</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Connections</span>
                <span className="font-medium">{user.connections.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Requests</span>
                <span className="font-medium">{user.pendingReceived.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Find Projects
              </button>
              <button className="w-full bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
