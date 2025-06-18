"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, X, Star, MapPin, Filter, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"

const mockContractors = [
  {
    id: 1,
    name: "Mike Johnson",
    company: "Johnson Construction",
    specialties: ["General Contracting", "Kitchen Remodeling", "Bathroom Renovation"],
    experience: 12,
    rating: 4.8,
    reviews: 156,
    location: "Downtown, 2.3 miles",
    avatar: "/placeholder.svg?height=80&width=80",
    portfolio: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    certifications: ["Licensed", "Insured", "BBB A+"],
    availability: "Available this week",
    description:
      "Experienced general contractor specializing in high-end residential renovations. Known for quality craftsmanship and timely project completion.",
  },
  {
    id: 2,
    name: "Sarah Martinez",
    company: "Elite Plumbing Services",
    specialties: ["Plumbing", "Water Heater Installation", "Pipe Repair"],
    experience: 8,
    rating: 4.9,
    reviews: 203,
    location: "Midtown, 1.8 miles",
    avatar: "/placeholder.svg?height=80&width=80",
    portfolio: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    certifications: ["Master Plumber", "Licensed", "Insured"],
    availability: "Available next week",
    description:
      "Master plumber with expertise in residential and commercial plumbing systems. Emergency services available 24/7.",
  },
  {
    id: 3,
    name: "David Rodriguez",
    company: "Rodriguez Electrical",
    specialties: ["Electrical", "Smart Home", "Panel Upgrades"],
    experience: 10,
    rating: 4.7,
    reviews: 89,
    location: "Westside, 3.1 miles",
    avatar: "/placeholder.svg?height=80&width=80",
    portfolio: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    certifications: ["Licensed Electrician", "Smart Home Certified"],
    availability: "Available today",
    description:
      "Certified electrician specializing in modern electrical systems and smart home automation installations.",
  },
]

export default function DiscoverPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    specialty: "",
    distance: "",
    experience: "",
    availability: "",
  })
  const cardRef = useRef<HTMLDivElement>(null)

  const currentContractor = mockContractors[currentIndex]

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      // Liked - could save to favorites
      console.log("Liked contractor:", currentContractor.name)
    }

    if (currentIndex < mockContractors.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0) // Loop back to start
    }
  }

  const handleCardClick = () => {
    // Navigate to contractor detail page
    window.location.href = `/contractor/${currentContractor.id}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">Discover Contractors</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select value={filters.specialty} onValueChange={(value) => setFilters({ ...filters, specialty: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Contracting</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.distance} onValueChange={(value) => setFilters({ ...filters, distance: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Within 1 mile</SelectItem>
                  <SelectItem value="5">Within 5 miles</SelectItem>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                value={filters.experience}
                onValueChange={(value) => setFilters({ ...filters, experience: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.availability}
                onValueChange={(value) => setFilters({ ...filters, availability: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Available today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="relative h-[600px]">
          <Card
            ref={cardRef}
            className="absolute inset-0 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleCardClick}
          >
            <CardContent className="p-0 h-full">
              {/* Portfolio Image */}
              <div className="relative h-64 bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={currentContractor.portfolio[0] || "/placeholder.svg"}
                  alt="Portfolio"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90">
                    {currentContractor.availability}
                  </Badge>
                </div>
              </div>

              {/* Contractor Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={currentContractor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {currentContractor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{currentContractor.name}</h3>
                      <p className="text-sm text-gray-600">{currentContractor.company}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{currentContractor.rating}</span>
                          <span className="text-sm text-gray-500">({currentContractor.reviews})</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{currentContractor.experience} years</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{currentContractor.location}</span>
                </div>

                <p className="text-sm text-gray-700">{currentContractor.description}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentContractor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentContractor.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Portfolio</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {currentContractor.portfolio.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6 mt-6">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 p-0 border-red-200 hover:bg-red-50"
            onClick={() => handleSwipe("left")}
          >
            <X className="h-6 w-6 text-red-500" />
          </Button>

          <Button
            size="lg"
            className="rounded-full w-14 h-14 p-0 bg-blue-600 hover:bg-blue-700"
            onClick={() => (window.location.href = `/messages?contractor=${currentContractor.id}`)}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 p-0 border-green-200 hover:bg-green-50"
            onClick={() => handleSwipe("right")}
          >
            <Heart className="h-6 w-6 text-green-500" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {mockContractors.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
