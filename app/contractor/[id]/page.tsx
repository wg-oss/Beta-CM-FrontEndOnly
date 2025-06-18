"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  MessageCircle,
  Heart,
  Phone,
  Mail,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

const contractorData = {
  id: 1,
  name: "Mike Johnson",
  company: "Johnson Construction",
  specialties: ["General Contracting", "Kitchen Remodeling", "Bathroom Renovation", "Home Additions"],
  experience: 12,
  rating: 4.8,
  reviews: 156,
  location: "Downtown, 2.3 miles",
  avatar: "/placeholder.svg?height=100&width=100",
  coverImage: "/placeholder.svg?height=200&width=400",
  portfolio: [
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=400",
      title: "Modern Kitchen Renovation",
      description: "Complete kitchen overhaul with custom cabinets and granite countertops",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=300&width=400",
      title: "Luxury Bathroom Remodel",
      description: "Spa-like bathroom with walk-in shower and heated floors",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=300&width=400",
      title: "Home Addition Project",
      description: "500 sq ft addition with seamless integration",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=300&width=400",
      title: "Basement Finishing",
      description: "Complete basement transformation into entertainment space",
    },
  ],
  certifications: ["Licensed General Contractor", "Insured", "BBB A+ Rating", "OSHA Certified"],
  availability: "Available this week",
  description:
    "Experienced general contractor specializing in high-end residential renovations. Known for quality craftsmanship and timely project completion. I take pride in transforming homes and exceeding client expectations.",
  contact: {
    phone: "(555) 123-4567",
    email: "mike@johnsonconstruction.com",
  },
  reviews: [
    {
      id: 1,
      author: "Jennifer Smith",
      rating: 5,
      date: "2 weeks ago",
      content:
        "Mike did an amazing job on our kitchen renovation. Professional, timely, and the quality is outstanding. Highly recommend!",
    },
    {
      id: 2,
      author: "Robert Chen",
      rating: 5,
      date: "1 month ago",
      content:
        "Excellent work on our bathroom remodel. Mike was communicative throughout the process and delivered exactly what we wanted.",
    },
    {
      id: 3,
      author: "Lisa Rodriguez",
      rating: 4,
      date: "2 months ago",
      content:
        "Great contractor! The home addition looks fantastic and was completed on schedule. Very professional team.",
    },
  ],
  workHours: "Mon-Fri: 7:00 AM - 6:00 PM, Sat: 8:00 AM - 4:00 PM",
  responseTime: "Usually responds within 2 hours",
}

export default function ContractorProfile({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/discover">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">Contractor Profile</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsFavorited(!isFavorited)}>
              <Heart className={`h-5 w-5 ${isFavorited ? "text-red-500 fill-current" : "text-gray-400"}`} />
            </Button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative h-48 bg-gray-200">
        <img src={contractorData.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={contractorData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">
                  {contractorData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{contractorData.name}</h1>
                    <p className="text-lg text-gray-600">{contractorData.company}</p>

                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-medium">{contractorData.rating}</span>
                        <span className="text-gray-500">({contractorData.reviews.length} reviews)</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600">{contractorData.experience} years experience</span>
                    </div>

                    <div className="flex items-center space-x-1 mt-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{contractorData.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                    <Badge variant="secondary" className="w-fit">
                      <Clock className="h-3 w-3 mr-1" />
                      {contractorData.availability}
                    </Badge>
                    <Badge variant="outline" className="w-fit">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {contractorData.responseTime}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mt-4">{contractorData.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {contractorData.specialties.map((specialty) => (
                <Badge key={specialty} variant="outline">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button size="lg" className="w-full">
            <MessageCircle className="h-5 w-5 mr-2" />
            Send Message
          </Button>
          <Button size="lg" variant="outline" className="w-full">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Certifications & Credentials</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contractorData.certifications.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{contractorData.workHours}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contractorData.portfolio.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {contractorData.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{review.author}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>{contractorData.contact.phone}</span>
                  <Button size="sm" variant="outline">
                    Call
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>{contractorData.contact.email}</span>
                  <Button size="sm" variant="outline">
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send a Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Request a Quote
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
