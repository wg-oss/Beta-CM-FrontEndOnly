"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { X, Filter } from "lucide-react"

interface ContractorPreferencesProps {
  onPreferencesChange: (preferences: { distance: number; specialty: string; experience: number }) => void
  specialties: string[]
  initialOpen?: boolean
  onClose: () => void
}

const ContractorPreferences: React.FC<ContractorPreferencesProps> = ({
  onPreferencesChange,
  specialties,
  initialOpen = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [distance, setDistance] = useState([25])
  const [specialty, setSpecialty] = useState("all")
  const [experience, setExperience] = useState([0])

  const handleApplyFilters = () => {
    onPreferencesChange({
      distance: distance[0],
      specialty,
      experience: experience[0],
    })
    setIsOpen(false)
    onClose()
  }

  const handleReset = () => {
    setDistance([25])
    setSpecialty("all")
    setExperience([0])
    onPreferencesChange({
      distance: 25,
      specialty: "all",
      experience: 0,
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed top-20 right-4 z-20">
        <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filter Contractors</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Distance: {distance[0]} miles</Label>
            <Slider value={distance} onValueChange={setDistance} max={50} min={1} step={1} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label>Specialty</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Minimum Experience: {experience[0]} years</Label>
            <Slider value={experience} onValueChange={setExperience} max={20} min={0} step={1} className="w-full" />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContractorPreferences
