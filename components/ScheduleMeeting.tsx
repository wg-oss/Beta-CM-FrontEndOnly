"use client"

import type React from "react"
import { useState } from "react"
import { format, addMinutes, parse, isBefore, startOfDay } from "date-fns"
import { Calendar, Clock, X } from "lucide-react"
import type { Contractor } from "../types"

interface ScheduleMeetingProps {
  contractor: Contractor
  onClose: () => void
  onSchedule: (slot: {
    date: string
    startTime: string
    endTime: string
    realtorId: string
    status: "confirmed"
  }) => void
  currentUserId: string
}

const ScheduleMeeting: React.FC<ScheduleMeetingProps> = ({ contractor, onClose, onSchedule, currentUserId }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")

  const availability = contractor.availability || {
    workingHours: { start: "09:00", end: "17:00" },
    workingDays: [1, 2, 3, 4, 5], // Mon-Fri
    meetingDuration: 30,
    bookedSlots: [],
  }

  const getAvailableSlots = (date: Date) => {
    const slots: string[] = []
    const dayOfWeek = date.getDay()

    if (!availability.workingDays.includes(dayOfWeek)) {
      return slots
    }

    const baseDate = startOfDay(date)
    const startTime = parse(availability.workingHours.start, "HH:mm", baseDate)
    const endTime = parse(availability.workingHours.end, "HH:mm", baseDate)

    let currentSlot = startTime
    while (isBefore(currentSlot, endTime)) {
      const formattedTime = format(currentSlot, "HH:mm")

      const isBooked = availability.bookedSlots.some(
        (bookedSlot) =>
          format(new Date(bookedSlot.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
          bookedSlot.startTime === formattedTime,
      )

      if (!isBooked) {
        slots.push(formattedTime)
      }

      currentSlot = addMinutes(currentSlot, availability.meetingDuration)
    }

    return slots
  }

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) return

    const meetingDate = startOfDay(selectedDate)
    const startTimeDate = parse(selectedTime, "HH:mm", meetingDate)
    const endTimeDate = addMinutes(startTimeDate, availability.meetingDuration)

    const slot = {
      date: meetingDate.toISOString(),
      startTime: format(startTimeDate, "HH:mm"),
      endTime: format(endTimeDate, "HH:mm"),
      realtorId: currentUserId,
      status: "confirmed" as const,
    }

    onSchedule(slot)
  }

  const availableSlots = getAvailableSlots(selectedDate)
  const today = new Date()
  const maxDate = addMinutes(today, 60 * 24 * 30) // Allow booking up to 30 days in advance

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overscroll-none">
      <div className="bg-white w-full max-w-sm sm:max-w-md rounded-xl p-6 transform transition-all duration-300 scale-100 animate-in fade-in-20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Schedule Meeting with {contractor.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2 text-blue-500" />
              Select Date
            </label>
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => {
                const newDate = new Date(e.target.value)
                setSelectedDate(newDate)
                setSelectedTime("")
              }}
              min={format(today, "yyyy-MM-dd")}
              max={format(maxDate, "yyyy-MM-dd")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-2 text-blue-500" />
              Select Time
            </label>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No available slots for this date</p>
            )}
          </div>

          <button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScheduleMeeting
