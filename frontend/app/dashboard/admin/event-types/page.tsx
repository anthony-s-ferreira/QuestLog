"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"
import { ShieldAlert, Search, Plus, MoreHorizontal, Edit, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
    Pagination,
    PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import { CreateEventTypeDialog } from "@/components/dashboard/create-event-type-dialog"
import { EditEventTypeDialog } from "@/components/dashboard/edit-event-type-dialog"

export default function AdminEventTypesPage() {
  const { user, signIn, signOut, isAdmin } = useAuth();
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(2)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingEventType, setEditingEventType] = useState<EventType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventTypeToDelete, setEventTypeToDelete] = useState<EventType | null>(null)

  useEffect(() => {
    // Check if user is admin
    const adminCheck = isAdmin()
    setIsAuthorized(adminCheck)

    if (!adminCheck) {
      // Redirect to dashboard if not admin
      router.push("/dashboard")
    }
  }, [router])

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // This would normally fetch data for the new page
  }

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

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShieldAlert className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Admin Access Required</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You need administrator privileges to access this page. Please contact your system administrator if you believe
          this is an error.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Types</h1>
          <p className="text-muted-foreground">Manage event types for all campaigns</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Event Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Types Management</CardTitle>
          <CardDescription>Create, edit, and manage event types that can be used across all campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search event types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
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
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) handlePageChange(currentPage - 1)
                      }}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === totalPages}
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(totalPages)
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) handlePageChange(currentPage + 1)
                      }}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateEventTypeDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

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
    </div>
  )
}

// Type definition for event type
interface EventType {
  id: string
  name: string
  description: string
  count: number
}

