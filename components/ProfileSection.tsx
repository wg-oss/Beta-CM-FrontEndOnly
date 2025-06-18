"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Edit,
  MapPin,
  Star,
  Calendar,
  Building,
  Mail,
  Phone,
  Plus,
  MessageCircle,
  Settings,
} from "lucide-react"
import type { User, Post, PortfolioItem } from "../types"

interface ProfileSectionProps {
  currentUser: User
  viewingUser?: User
  onBack?: () => void
  onLogout?: () => void
  posts: Post[]
  allUsers: User[]
  onViewProfile: (user: User) => void
  onAddProject?: (project: PortfolioItem) => void
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  currentUser,
  viewingUser,
  onBack,
  onLogout,
  posts,
  allUsers,
  onViewProfile,
  onAddProject,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    images: [""],
  })

  const profileUser = viewingUser || currentUser
  const isOwnProfile = !viewingUser || viewingUser.id === currentUser.id

  const handleAddProject = () => {
    if (newProject.title && newProject.description && onAddProject) {
      const project: PortfolioItem = {
        id: `project-${Date.now()}`,
        title: newProject.title,
        description: newProject.description,
        images: newProject.images.filter((img) => img.trim() !== ""),
        completionDate: new Date().toISOString(),
      }
      onAddProject(project)
      setNewProject({ title: "", description: "", images: [""] })
      setShowAddProject(false)
    }
  }

  const userPosts = posts.filter((post) => post.userId === profileUser.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      {viewingUser && onBack && (
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">{profileUser.name}</h1>
        </div>
      )}

      {/* Profile Header with Cover Image */}
      <Card>
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg relative">
          {/* Profile Actions in Top Right */}
          {isOwnProfile && (
            <div className="absolute top-4 right-4 flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      // Save logic would go here
                    }}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    size="sm"
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="sm"
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {onLogout && (
                    <Button
                      onClick={onLogout}
                      size="sm"
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-6">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={profileUser.photo || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {profileUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardContent className="pt-20 pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileUser.name}
                      onChange={(e) => {
                        // Update logic would go here
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileUser.company || ""}
                      onChange={(e) => {
                        // Update logic would go here
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileUser.bio || ""}
                      onChange={(e) => {
                        // Update logic would go here
                      }}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{profileUser.name}</h1>
                  <p className="text-lg text-gray-600">
                    {profileUser.role === "contractor" ? profileUser.specialty : profileUser.company}
                  </p>

                  <div className="flex items-center space-x-4 mt-2">
                    {profileUser.role === "contractor" && profileUser.rating && (
                      <>
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="font-medium">{profileUser.rating}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                      </>
                    )}
                    <span className="text-gray-600">{profileUser.yearsExperience || 0} years experience</span>
                  </div>

                  <div className="flex items-center space-x-1 mt-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Seattle, WA</span>
                  </div>
                </>
              )}
            </div>

            {!isOwnProfile && (
              <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </div>
            )}
          </div>

          {profileUser.bio && !isEditing && (
            <div className="mt-6">
              <p className="text-gray-700">{profileUser.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{profileUser.connections?.length || 0}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {profileUser.role === "contractor" ? profileUser.portfolio?.length || 0 : userPosts.length}
            </div>
            <div className="text-sm text-gray-600">{profileUser.role === "contractor" ? "Projects" : "Posts"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {profileUser.role === "contractor" ? profileUser.rating || 0 : "4.8"}
            </div>
            <div className="text-sm text-gray-600">Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{profileUser.yearsExperience || 0}</div>
            <div className="text-sm text-gray-600">Years Exp.</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">{profileUser.role === "contractor" ? "Portfolio" : "Posts"}</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {profileUser.bio ||
                  `Experienced ${profileUser.role} with ${profileUser.yearsExperience || 0} years in the industry.`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm text-gray-700">{post.content.slice(0, 100)}...</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{profileUser.role === "contractor" ? "Portfolio" : "Posts"}</h2>
            {isOwnProfile && profileUser.role === "contractor" && (
              <Button onClick={() => setShowAddProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>

          {showAddProject && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe your project"
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newProject.images[0]}
                    onChange={(e) => setNewProject({ ...newProject, images: [e.target.value] })}
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddProject}>Add Project</Button>
                  <Button variant="outline" onClick={() => setShowAddProject(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {profileUser.role === "contractor" && profileUser.portfolio ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileUser.portfolio.map((project) => (
                <Card key={project.id}>
                  <div className="aspect-video bg-gray-200">
                    <img
                      src={project.images[0] || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    <p className="text-xs text-gray-500">
                      Completed: {new Date(project.completionDate).toLocaleDateString()}
                    </p>
                    {project.clientFeedback && (
                      <p className="text-sm text-gray-700 mt-2 italic">"{project.clientFeedback}"</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <p className="text-gray-900 mb-2">{post.content}</p>
                    {post.images && post.images.length > 0 && (
                      <img
                        src={post.images[0] || "/placeholder.svg"}
                        alt="Post content"
                        className="w-full h-48 object-cover rounded-lg mb-2"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                        }}
                      />
                    )}
                    <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{profileUser.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-500" />
                <span>{profileUser.role === "contractor" ? profileUser.company : profileUser.company}</span>
              </div>
            </CardContent>
          </Card>

          {!isOwnProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileSection
