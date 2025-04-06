"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { postEventType } from "@/services/eventTypeService"
import { useToast } from "@/hooks/use-toast"

interface CreateEventTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEventTypeDialog({ open, onOpenChange }: CreateEventTypeDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const eventTypeData = {name: name, description: description}
      const response = await postEventType(eventTypeData);
      handleSubmitSuccess();
      setName("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      console.log('Error:' + error);
      handleSubmitError(error);
    } finally {
      setIsLoading(false);
    }

  }

  const handleSubmitError = (error: any) => {
    toast({
        title: "Error",
        description: error.response?.data?.message,
        variant: "destructive"
      })
  }

  const handleSubmitSuccess = () => {
    toast({
        title: "Success",
        description: "Event type created successfully",
        variant: "success"
    })
 }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Event Type</DialogTitle>
            <DialogDescription>Add a new event type that can be used across all campaigns.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Combat, Roleplay, Discovery, etc."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this event type represents..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

