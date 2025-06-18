"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, Camera } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import type { User, Post, Realtor, Contractor } from "../types"
import { postService, userService } from "@/lib/firebase-services"
import { useToast } from "@/components/ui/use-toast"

interface FeedProps {
  currentUser: User
  onViewProfile: (user: User) => void
  onConnect: (userId: string) => void
}

const Feed: React.FC<FeedProps> = ({ currentUser, onViewProfile, onConnect }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<Record<string, User>>({})
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [postType, setPostType] = useState<"general" | "project-showcase" | "certification">("general")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const fetchedPosts = await postService.getPosts()
      setPosts(fetchedPosts)

      // Load users for each post
      const userIds = new Set(fetchedPosts.map(post => post.userId))
      const userPromises = Array.from(userIds).map(id => userService.getUser(id))
      const fetchedUsers = await Promise.all(userPromises)
      
      const userMap = fetchedUsers.reduce((acc, user) => {
        if (user) {
          acc[user.id] = user
        }
        return acc
      }, {} as Record<string, User>)
      
      setUsers(userMap)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (newPostContent.trim()) {
      try {
        const newPost = await postService.createPost({
          userId: currentUser.id,
          content: newPostContent,
          images: [],
          likes: [],
          comments: [],
          type: postType,
        })
        
        setPosts(prev => [newPost, ...prev])
        setNewPostContent("")
        setShowCreatePost(false)
        
        toast({
          title: "Success",
          description: "Post created successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create post",
          variant: "destructive",
        })
      }
    }
  }

  const getPostUser = (userId: string) => {
    return users[userId]
  }

  const getUserDisplayInfo = (user: User) => {
    if (user.role === "contractor") {
      const contractor = user as Contractor
      return contractor.specialty
    } else {
      const realtor = user as Realtor
      return realtor.company
    }
  }

  const getTimeAgo = (timestamp: any) => {
    const now = new Date()
    const postDate = timestamp instanceof Date ? timestamp : timestamp.toDate()
    const diffInMs = now.getTime() - postDate.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`
    } else {
      return `${Math.floor(diffInDays / 7)}w ago`
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading posts...</div>
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card>
        <CardContent className="p-4">
          {!showCreatePost ? (
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={currentUser.photo || "/placeholder.svg"} />
                <AvatarFallback>
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex-1 text-left px-4 py-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
              >
                What's on your mind?
              </button>
              <Button size="sm" variant="outline">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={currentUser.photo || "/placeholder.svg"} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-gray-500">
                    {getUserDisplayInfo(currentUser)}
                  </p>
                </div>
              </div>
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share an update, project, or achievement..."
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Badge
                    variant={postType === "general" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setPostType("general")}
                  >
                    General
                  </Badge>
                  <Badge
                    variant={postType === "project-showcase" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setPostType("project-showcase")}
                  >
                    Project
                  </Badge>
                  <Badge
                    variant={postType === "certification" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setPostType("certification")}
                  >
                    Achievement
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                    Post
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {posts.map((post) => {
        const postUser = getPostUser(post.userId)
        if (!postUser) return null

        return (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewProfile(postUser)}>
                  <Avatar>
                    <AvatarImage src={postUser.photo || "/placeholder.svg"} />
                    <AvatarFallback>
                      {postUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{postUser.name}</p>
                    <p className="text-sm text-gray-500">
                      {getUserDisplayInfo(postUser)} • {getTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {post.type.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-900 mb-3">{post.content}</p>

              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 gap-2 mb-3">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt="Post content"
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{post.likes.length}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post.comments.length}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                {postUser.id !== currentUser.id && (
                  <Button size="sm" variant="outline" onClick={() => onConnect(postUser.id)}>
                    Connect
                  </Button>
                )}
              </div>

              {post.comments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {post.comments.slice(0, 2).map((comment) => {
                    const commentUser = getPostUser(comment.userId)
                    return (
                      <div key={comment.id} className="flex items-start space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={commentUser?.photo || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {commentUser?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                          <p className="text-sm font-medium">{commentUser?.name}</p>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default Feed
