"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Star, Building } from "lucide-react"
import type { User } from "../types"

interface NetworkSectionProps {
  currentUser: User
  onViewProfile: (user: User) => void
}

const NetworkSection: React.FC<NetworkSectionProps> = ({ currentUser, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState<"connections" | "suggestions">("connections")

  // Mock data for connections and suggestions
  const connections = [
    {
      id: "c1",
      name: "John Smith",
      role: "contractor" as const,
      specialty: "Kitchen Remodeling",
      company: "Smith Renovations",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      mutualConnections: 3,
    },
    {
      id: "r2",
      name: "Michael Chen",
      role: "realtor" as const,
      company: "Luxury Real Estate Group",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      mutualConnections: 5,
    },
  ]

  const suggestions = [
    {
      id: "c2",
      name: "Sarah Johnson",
      role: "contractor" as const,
      specialty: "Bathroom Remodeling",
      company: "Johnson Bath & Kitchen",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      reason: "Works in your area",
    },
    {
      id: "c3",
      name: "David Martinez",
      role: "contractor" as const,
      specialty: "Custom Carpentry",
      company: "Martinez Custom Woodworks",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      reason: "Mutual connection with John Smith",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{connections.length}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">Messages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="text-sm text-gray-600">Projects</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("connections")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "connections" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Connections
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "suggestions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Suggestions
        </button>
      </div>

      {/* Content */}
      {activeTab === "connections" ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Connections</h2>
          {connections.map((connection) => (
            <Card key={connection.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4" onClick={() => onViewProfile(connection as User)}>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.photo || "/placeholder.svg"} />
                      <AvatarFallback>
                        {connection.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                      <p className="text-sm text-gray-600">
                        {connection.role === "contractor" ? connection.specialty : connection.company}
                      </p>
                      {connection.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{connection.rating}</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{connection.mutualConnections} mutual connections</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">People You May Know</h2>
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() => onViewProfile(suggestion as User)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={suggestion.photo || "/placeholder.svg"} />
                      <AvatarFallback>
                        {suggestion.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{suggestion.name}</h3>
                      <p className="text-sm text-gray-600">
                        {suggestion.role === "contractor" ? suggestion.specialty : suggestion.company}
                      </p>
                      {suggestion.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{suggestion.rating}</span>
                        </div>
                      )}
                      <Badge variant="secondary" className="text-xs mt-1">
                        {suggestion.reason}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default NetworkSection
