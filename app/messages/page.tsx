"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Paperclip, Calendar, Phone, Video, MoreVertical } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  firstName: string
  lastName: string
  role: string
  photoURL: string
}

interface Conversation {
  id: string
  participants: string[]
  lastMessage: {
    content: string
    timestamp: any
    senderId: string
  }
  unreadCount: { [key: string]: number }
}

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: any
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<{ [key: string]: User }>({})
  const [newMessage, setNewMessage] = useState("")
  const [showConversationList, setShowConversationList] = useState(true)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login")
        return
      }

      try {
        // Listen for conversations
        const conversationsQuery = query(
          collection(db, "conversations"),
          where("participants", "array-contains", firebaseUser.uid),
          orderBy("lastMessage.timestamp", "desc")
        )

        const unsubscribeConversations = onSnapshot(conversationsQuery, async (snapshot) => {
          const conversationsData: Conversation[] = []
          const userIds = new Set<string>()

          snapshot.forEach((doc) => {
            const data = doc.data() as Conversation
            data.id = doc.id
            conversationsData.push(data)
            data.participants.forEach((id) => userIds.add(id))
          })

          setConversations(conversationsData)

          // Fetch user data for all participants
          const usersData: { [key: string]: User } = {}
          for (const userId of userIds) {
            if (userId === firebaseUser.uid) continue

            const userRole = localStorage.getItem("userRole")
            if (!userRole) continue

            const userDoc = await getDoc(doc(db, `${userRole}s`, userId))
            if (userDoc.exists()) {
              const userData = userDoc.data() as User
              usersData[userId] = userData
            }
          }

          setUsers(usersData)
          setLoading(false)
        })

        return () => {
          unsubscribeConversations()
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (!selectedConversation) return

    const messagesQuery = query(
      collection(db, "conversations", selectedConversation.id, "messages"),
      orderBy("timestamp", "asc")
    )

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData: Message[] = []
      snapshot.forEach((doc) => {
        const data = doc.data() as Message
        data.id = doc.id
        messagesData.push(data)
      })
      setMessages(messagesData)
    })

    return () => {
      unsubscribeMessages()
    }
  }, [selectedConversation])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const user = auth.currentUser
      if (!user) return

      await addDoc(collection(db, "conversations", selectedConversation.id, "messages"), {
        content: newMessage.trim(),
        senderId: user.uid,
        timestamp: serverTimestamp(),
      })

      // Update last message in conversation
      await updateDoc(doc(db, "conversations", selectedConversation.id), {
        "lastMessage.content": newMessage.trim(),
        "lastMessage.senderId": user.uid,
        "lastMessage.timestamp": serverTimestamp(),
      })

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setShowConversationList(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {!showConversationList ? (
                <Button variant="ghost" size="sm" onClick={() => setShowConversationList(true)} className="md:hidden">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <h1 className="text-lg font-semibold">
                {showConversationList ? "Messages" : selectedConversation && users[selectedConversation.participants.find(id => id !== auth.currentUser?.uid) || ""]?.firstName}
              </h1>
              {!showConversationList && selectedConversation && (
                <Badge variant="secondary" className="text-xs">
                  {users[selectedConversation.participants.find(id => id !== auth.currentUser?.uid) || ""]?.role}
                </Badge>
              )}
            </div>
            {!showConversationList && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto flex h-[calc(100vh-80px)]">
        {/* Conversations List */}
        <div
          className={`${showConversationList ? "block" : "hidden"} md:block w-full md:w-1/3 bg-white border-r border-gray-200`}
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
          </div>

          <div className="overflow-y-auto">
            {conversations.map((conversation) => {
              const otherUserId = conversation.participants.find(id => id !== auth.currentUser?.uid)
              const otherUser = otherUserId ? users[otherUserId] : null
              if (!otherUser) return null

              return (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?.id === conversation.id ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={otherUser.photoURL || "/placeholder.svg"} />
                        <AvatarFallback>
                          {otherUser.firstName[0]}
                          {otherUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {otherUser.firstName} {otherUser.lastName}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessage.timestamp?.toDate().toLocaleTimeString()}
                          </span>
                          {conversation.unreadCount[auth.currentUser?.uid || ""] > 0 && (
                            <Badge variant="default" className="text-xs px-2 py-1 min-w-[20px] h-5">
                              {conversation.unreadCount[auth.currentUser?.uid || ""]}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{otherUser.role}</p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${showConversationList ? "hidden" : "block"} md:block flex-1 flex flex-col bg-white`}>
          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === auth.currentUser?.uid
                  const sender = isOwn ? auth.currentUser : users[message.senderId]

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp?.toDate().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
