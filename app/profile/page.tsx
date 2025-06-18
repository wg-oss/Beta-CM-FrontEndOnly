"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db, storage } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { onAuthStateChanged } from "firebase/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Camera, Star, MapPin, Calendar, Settings, Edit, Plus, X } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "realtor" | "contractor"
  company?: string
  phone?: string
  location: string
  photoURL: string
  about: string
  specialties: string[]
  experience?: number
  rating?: number
  reviews?: number
  connections: string[]
  pendingSent: string[]
  pendingReceived: string[]
  certifications?: string[]
  availability?: string
  portfolio?: Array<{ id: number; image: string; title: string }>
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [newSpecialty, setNewSpecialty] = useState("")
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login")
        return
      }

      try {
        const userRole = localStorage.getItem("userRole")
        if (!userRole) {
          router.push("/login")
          return
        }

        const userDoc = await getDoc(doc(db, `${userRole}s`, firebaseUser.uid))
        if (!userDoc.exists()) {
          router.push("/login")
          return
        }

        setProfile(userDoc.data() as UserProfile)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSave = async () => {
    if (!profile) return

    try {
      const userRole = localStorage.getItem("userRole")
      if (!userRole) return

      const user = auth.currentUser
      if (!user) return

      await updateDoc(doc(db, `${userRole}s`, user.uid), {
        firstName: profile.firstName,
        lastName: profile.lastName,
        company: profile.company,
        phone: profile.phone,
        location: profile.location,
        about: profile.about,
        specialties: profile.specialties,
      })

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !profile) return

    try {
      const file = e.target.files[0]
      const user = auth.currentUser
      if (!user) return

      const fileRef = ref(storage, `profilePhotos/${user.uid}`)
      await uploadBytes(fileRef, file)
      const photoURL = await getDownloadURL(fileRef)

      const userRole = localStorage.getItem("userRole")
      if (!userRole) return

      await updateDoc(doc(db, `${userRole}s`, user.uid), { photoURL })
      setProfile({ ...profile, photoURL })
    } catch (error) {
      console.error("Error uploading photo:", error)
    }
  }

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim() || !profile) return
    setProfile({
      ...profile,
      specialties: [...profile.specialties, newSpecialty.trim()],
    })
    setNewSpecialty("")
  }

  const handleRemoveSpecialty = (specialty: string) => {
    if (!profile) return
    setProfile({
      ...profile,
      specialties: profile.specialties.filter((s) => s !== specialty),
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href={`/${profile.role}-dashboard`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">Profile</h1>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.photoURL || "/placeholder.svg"} />
                      <AvatarFallback className="text-xl">
                        {profile.firstName[0]}
                        {profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full w-8 h-8 p-0 cursor-pointer"
                        >
                          <Camera className="h-3 w-3" />
                        </Button>
                      </label>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {profile.firstName} {profile.lastName}
                        </h1>
                        {profile.company && (
                          <p className="text-lg text-gray-600">{profile.company}</p>
                        )}

                        <div className="flex items-center space-x-4 mt-2">
                          {profile.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                              <span className="font-medium">{profile.rating}</span>
                              <span className="text-gray-500">
                                ({profile.reviews} reviews)
                              </span>
                            </div>
                          )}
                          {profile.experience && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-600">
                                {profile.experience} years experience
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center space-x-1 mt-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{profile.location}</span>
                        </div>
                      </div>

                      <Button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        variant={isEditing ? "default" : "outline"}
                        className="mt-4 md:mt-0"
                      >
                        {isEditing ? "Save Changes" : "Edit Profile"}
                        <Edit className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {isEditing ? (
                    <Textarea
                      value={profile.about}
                      onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-700">{profile.about}</p>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
                        {isEditing && (
                          <button
                            className="ml-1 hover:text-red-500"
                            onClick={() => handleRemoveSpecialty(specialty)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        <Input
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          placeholder="Add specialty"
                          className="h-6 w-32"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6"
                          onClick={handleAddSpecialty}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {profile.connections.length}
                  </div>
                  <div className="text-sm text-gray-600">Connections</div>
                </CardContent>
              </Card>
              {profile.role === "contractor" && profile.portfolio && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.portfolio.length}
                    </div>
                    <div className="text-sm text-gray-600">Projects</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {profile.role === "contractor" && profile.portfolio ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.portfolio.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-medium">{project.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No portfolio items available.</p>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email} disabled />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                  {profile.role === "contractor" && (
                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Input
                        id="availability"
                        value={profile.availability || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, availability: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
