"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, CheckCircle, X, UserIcon } from "lucide-react"
import type { Contractor, User } from "../types"

interface MeetingManagementPageProps {
  currentUser: Contractor
  allUsers: User[]
}

const MeetingManagementPage: React.FC<MeetingManagementPageProps> = ({ currentUser, allUsers }) => {
  const [meetings] = useState(currentUser.availability?.bookedSlots || [])
  const [pendingMeetings, setPendingMeetings] = useState(currentUser.pendingMeetings || [])

  const handleAcceptMeeting = (meetingId: string) => {
    setPendingMeetings(pendingMeetings.filter((m) => m.id !== meetingId))
    // In a real app, this would update the backend
  }

  const handleDeclineMeeting = (meetingId: string) => {
    setPendingMeetings(pendingMeetings.filter((m) => m.id !== meetingId))
    // In a real app, this would update the backend
  }

  const getRealtorInfo = (realtorId: string) => {
    return allUsers.find((user) => user.id === realtorId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting Management</h1>
        <p className="text-gray-600">Manage your scheduled meetings and pending requests</p>
      </div>

      {/* Pending Meeting Requests */}
      {pendingMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span>Pending Requests ({pendingMeetings.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingMeetings.map((meeting) => {
              const realtor = getRealtorInfo(meeting.realtorId)
              return (
                <div key={meeting.id} className="border rounded-lg p-4 bg-orange-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={realtor?.photo || "/placeholder.svg"} />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{realtor?.name || "Unknown Realtor"}</h3>
                        <p className="text-sm text-gray-600">{realtor?.company}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(meeting.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                            </span>
                          </div>
                        </div>
                        {meeting.notes && <p className="text-sm text-gray-700 mt-2">"{meeting.notes}"</p>}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleAcceptMeeting(meeting.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeclineMeeting(meeting.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Confirmed Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Confirmed Meetings ({meetings.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meetings.length > 0 ? (
            <div className="space-y-4">
              {meetings.map((meeting, index) => {
                const realtor = getRealtorInfo(meeting.realtorId)
                return (
                  <div key={index} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={realtor?.photo || "/placeholder.svg"} />
                          <AvatarFallback>
                            <UserIcon className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{realtor?.name || "Unknown Realtor"}</h3>
                          <p className="text-sm text-gray-600">{realtor?.company}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(meeting.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                              </span>
                            </div>
                          </div>
                          {meeting.notes && <p className="text-sm text-gray-700 mt-2">"{meeting.notes}"</p>}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Confirmed
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No confirmed meetings yet</p>
              <p className="text-sm text-gray-400">Meeting requests will appear here once accepted</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability Status */}
      <Card>
        <CardHeader>
          <CardTitle>Your Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Working Hours:</span>
              <span className="text-sm text-gray-600">
                {formatTime(currentUser.availability?.workingHours.start || "09:00")} -{" "}
                {formatTime(currentUser.availability?.workingHours.end || "17:00")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Working Days:</span>
              <span className="text-sm text-gray-600">Monday - Friday</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Meeting Duration:</span>
              <span className="text-sm text-gray-600">{currentUser.availability?.meetingDuration || 30} minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MeetingManagementPage
