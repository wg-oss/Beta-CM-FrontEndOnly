"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Calendar, Star, Home, Search, Users, User } from "lucide-react"
import Link from "next/link"

const mockPosts = [
  {
    id: 1,
    user: {
      name: "Mike Johnson",
      role: "General Contractor",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
    },
    content: "Just completed a beautiful kitchen renovation in downtown! The homeowners are thrilled with the results.",
    image: "/placeholder.svg?height=300&width=400",
    likes: 24,
    comments: 8,
    timestamp: "2 hours ago",
    tags: ["Kitchen", "Renovation"],
  },
  {
    id: 2,
    user: {
      name: "Sarah Chen",
      role: "Realtor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Looking for a reliable plumber for a property inspection tomorrow. Any recommendations?",
    likes: 12,
    comments: 15,
    timestamp: "4 hours ago",
    tags: ["Plumbing", "Urgent"],
  },
  {
    id: 3,
    user: {
      name: "David Rodriguez",
      role: "Electrical Contractor",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
    },
    content: "New certification achieved! Now offering smart home automation installations.",
    image: "/placeholder.svg?height=200&width=400",
    likes: 31,
    comments: 6,
    timestamp: "1 day ago",
    tags: ["Electrical", "Smart Home", "Certification"],
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home")

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center p-2 ${activeTab === "home" ? "text-blue-600" : "text-gray-400"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <Link href="/discover" className="flex flex-col items-center p-2 text-gray-400">
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Discover</span>
        </Link>
        <Link href="/messages" className="flex flex-col items-center p-2 text-gray-400">
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs mt-1">Messages</span>
        </Link>
        <button
          onClick={() => setActiveTab("network")}
          className={`flex flex-col items-center p-2 ${activeTab === "network" ? "text-blue-600" : "text-gray-400"}`}
        >
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Network</span>
        </button>
        <Link href="/profile" className="flex flex-col items-center p-2 text-gray-400">
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">ProConnect</span>
            </div>
            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/discover">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium">Find Contractors</p>
                    <p className="text-sm text-gray-500">Browse profiles</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/messages">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-gray-500">3 unread</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Feed */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Updates</h2>

              {mockPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {post.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{post.user.name}</p>
                          {post.user.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{post.user.rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {post.user.role} • {post.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-900 mb-3">{post.content}</p>

                    {post.image && (
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post content"
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                      </div>
                      <Button size="sm" variant="ghost">
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "network" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Network</h2>

            <div className="grid gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>MJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Mike Johnson</p>
                        <p className="text-sm text-gray-500">General Contractor</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">4.8 • 12 years exp</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>DR</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">David Rodriguez</p>
                        <p className="text-sm text-gray-500">Electrical Contractor</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">4.9 • 8 years exp</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
