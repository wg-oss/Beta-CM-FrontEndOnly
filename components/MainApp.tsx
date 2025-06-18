"use client"

import { useState } from "react"
import { Home, Search, MessageCircle, Users, User, Calendar, Settings } from "lucide-react"
import ContractorCard from "./ContractorCard"
import ScheduleMeeting from "./ScheduleMeeting"
import { realtors, contractors } from "../data/users"
import { posts as initialPosts } from "../data/posts"
import type { Contractor, User as UserType } from "../types"

interface CurrentUser {
  id: string
  role: "realtor" | "contractor"
  username?: string
  email?: string
}

interface MainAppProps {
  currentUser: CurrentUser
  onLogout: () => void
}

export default function MainApp({ currentUser, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [currentContractorIndex, setCurrentContractorIndex] = useState(0)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null)
  const [posts, setPosts] = useState(initialPosts)

  // Get current user data
  const allUsers = [...realtors, ...contractors]
  const userData = allUsers.find((user) => user.id === currentUser.id)

  const handleScheduleMeeting = (contractor: Contractor) => {
    setSelectedContractor(contractor)
    setShowScheduleModal(true)
  }

  const handleScheduleConfirm = (slot: any) => {
    console.log("Meeting scheduled:", slot)
    setShowScheduleModal(false)
    setSelectedContractor(null)
  }

  const handleSwipeNext = () => {
    if (currentContractorIndex < contractors.length - 1) {
      setCurrentContractorIndex(currentContractorIndex + 1)
    } else {
      setCurrentContractorIndex(0)
    }
  }

  const handleSwipePrevious = () => {
    if (currentContractorIndex > 0) {
      setCurrentContractorIndex(currentContractorIndex - 1)
    } else {
      setCurrentContractorIndex(contractors.length - 1)
    }
  }

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center p-2 ${activeTab === "home" ? "text-blue-600" : "text-gray-400"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setActiveTab("discover")}
          className={`flex flex-col items-center p-2 ${activeTab === "discover" ? "text-blue-600" : "text-gray-400"}`}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Discover</span>
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex flex-col items-center p-2 ${activeTab === "messages" ? "text-blue-600" : "text-gray-400"}`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs mt-1">Messages</span>
        </button>
        <button
          onClick={() => setActiveTab("network")}
          className={`flex flex-col items-center p-2 ${activeTab === "network" ? "text-blue-600" : "text-gray-400"}`}
        >
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Network</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center p-2 ${activeTab === "profile" ? "text-blue-600" : "text-gray-400"}`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">ContractMatch</span>
            </div>
            <div className="flex items-center space-x-2">
              {currentUser.role === "contractor" && (
                <button
                  onClick={() => setActiveTab("meetings")}
                  className={`p-2 rounded-lg ${activeTab === "meetings" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
                >
                  <Calendar className="h-5 w-5" />
                </button>
              )}
              <button onClick={onLogout} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === "home" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {userData?.name || currentUser.username}!
              </h1>
              <p className="text-gray-600">
                {currentUser.role === "realtor"
                  ? "Find trusted contractors for your projects"
                  : "Connect with realtors and grow your business"}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab("discover")}
                className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
              >
                <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium">{currentUser.role === "realtor" ? "Find Contractors" : "Browse Network"}</p>
                <p className="text-sm text-gray-500">Discover professionals</p>
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
              >
                <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium">Messages</p>
                <p className="text-sm text-gray-500">Chat with connections</p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => {
                  const postUser = allUsers.find((u) => u.id === post.userId)
                  return (
                    <div key={post.id} className="flex items-start space-x-3">
                      <img
                        src={postUser?.photo || "/placeholder.svg?height=40&width=40"}
                        alt={postUser?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{postUser?.name}</span> {post.content.slice(0, 100)}...
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "discover" && currentUser.role === "realtor" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Discover Contractors</h2>
              <p className="text-gray-600">Swipe through contractor profiles</p>
            </div>

            <div className="relative h-[600px]">
              <ContractorCard
                contractor={contractors[currentContractorIndex]}
                currentUser={userData as UserType}
                onSchedule={() => handleScheduleMeeting(contractors[currentContractorIndex])}
              />
            </div>

            {/* Swipe Controls */}
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleSwipePrevious}
                className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-2xl">👈</span>
              </button>
              <button
                onClick={handleSwipeNext}
                className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-2xl">👉</span>
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2">
              {contractors.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentContractorIndex ? "bg-blue-600" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No messages yet</p>
              <p className="text-sm">Start connecting with professionals to begin conversations</p>
            </div>
          </div>
        )}

        {activeTab === "network" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Network</h2>
            <div className="text-center text-gray-500 py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No connections yet</p>
              <p className="text-sm">Start discovering and connecting with professionals</p>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <img
                src={userData?.photo || "/placeholder.svg?height=100&width=100"}
                alt={userData?.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-900">{userData?.name || currentUser.username}</h2>
              <p className="text-gray-600">{userData?.company}</p>
              <p className="text-sm text-gray-500 mt-2">
                {currentUser.role === "realtor" ? "Real Estate Professional" : "Contractor"}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-700">Experience</span>
                <span className="font-medium">{userData?.yearsExperience || 0} years</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-700">Connections</span>
                <span className="font-medium">{userData?.connections?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700">Role</span>
                <span className="font-medium capitalize">{currentUser.role}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full mt-6 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}

        {activeTab === "meetings" && currentUser.role === "contractor" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Meeting Management</h2>
            <div className="text-center text-gray-500 py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No meetings scheduled</p>
              <p className="text-sm">Meeting requests will appear here</p>
            </div>
          </div>
        )}
      </main>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && selectedContractor && (
        <ScheduleMeeting
          contractor={selectedContractor}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleConfirm}
          currentUserId={currentUser.id}
        />
      )}

      <BottomNav />
    </div>
  )
}
