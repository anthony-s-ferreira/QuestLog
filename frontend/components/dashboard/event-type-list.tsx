"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { EditEventTypeDialog } from "./edit-event-type-dialog"

interface EventTypeListProps {
  searchQuery?: string
}

export function EventTypeList({ searchQuery = "" }: EventTypeListProps) {
  const [editingEventType, setEditingEventType] = useState<EventType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventTypeToDelete, setEventTypeToDelete] = useState<EventType | null>(null)

  // This would normally fetch data from the API
  const eventTypes = [
    { id: "1", name: "Combat", description: "Battles, fights, and physical confrontations", count: 42 },
    { id: "2", name: "Roleplay", description: "Character interactions, dialogue, and social encounters", count: 56 },
    { id: "3", name: "Discovery", description: "Finding items, locations, or information", count: 28 },
    { id: "4", name: "Skill Challenge", description: "Tests of character abilities and skills", count: 19 },
    { id: "5", name: "Adventure", description: "Journeys, quests, and expeditions", count: 35 },
    { id: "6", name: "Other", description: "Miscellaneous events that don't fit other categories", count: 12 },
  ]

  // Filter event types based on search query
  const filteredEventTypes = searchQuery
    ? eventTypes.filter(
        (type) =>
          type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          type.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : eventTypes

  const handleEdit = (eventType: EventType) => {
    setEditingEventType(eventType)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (eventType: EventType) => {
    setEventTypeToDelete(eventType)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // This would normally call an API to delete the event type
    console.log(`Deleting event type: ${eventTypeToDelete?.name}`)
    setIsDeleteDialogOpen(false)
    setEventTypeToDelete(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Events</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEventTypes.map((type) => (
            <TableRow key={type.id}>
              <TableCell className="font-medium">
                <Badge variant="outline" className="font-medium">
                  {type.name}
                </Badge>
              </TableCell>
              <TableCell>{type.description}</TableCell>
              <TableCell className="text-right">{type.count}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(type)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(type)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {filteredEventTypes.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No event types found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <EditEventTypeDialog eventType={editingEventType} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event type "{eventTypeToDelete?.name}". This action cannot be undone and
              may affect {eventTypeToDelete?.count} events that use this type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Type definition for event type
interface EventType {
  id: string
  name: string
  description: string
}

