"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"
import { ShieldAlert, Search, Plus, MoreHorizontal, Scroll, User, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link"
import { getAllCharacters } from "@/services/adminService"
import { useToast } from "@/hooks/use-toast"
import { deleteCharacter } from "@/services/characterService"
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


export default function AdminCharactersPage() {
  const router = useRouter()
  const { user, signIn, signOut, isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)
  const [characters, setCharacters] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [characterToDelete, setCharacterToDelete] = useState(null)
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is admin
    const adminCheck = isAdmin()
    setIsAuthorized(adminCheck)

    if (!adminCheck) {
      router.push("/dashboard")
    }

    fetchData();
  }, [router, currentPage])

  const fetchData = async () => {
    const characters = await getAllCharacters(currentPage, 10);
    setCharacters(characters);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDelete = (character) => {
      setCharacterToDelete(character)
      setIsDeleteDialogOpen(true)
  }
  
  const confirmDelete = async () => {
    try {
      await deleteCharacter(characterToDelete.id);
      setCharacters((prev) => prev.filter((character) => character.id !== characterToDelete.id))
      handleDeleteSuccess()
    } catch {
      
    } finally {
      setIsDeleteDialogOpen(false)
      setCharacterToDelete(null)
    }
  }

  const handleDeleteSuccess = () => {
    toast({
      title: "Success",
      description: `Character "${characterToDelete.name}" deleted.`,
      variant: "success"
    })
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
          <h1 className="text-3xl font-bold tracking-tight">Characters</h1>
          <p className="text-muted-foreground">Manage all characters in the system</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Character
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Character Management</CardTitle>
          <CardDescription>View and manage all characters in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="flex w-full items-center space-x-2 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8"
              />
            </div>
          </div> */}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Character</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Campaign</TableHead>
                  {/* <TableHead>Created</TableHead> */}
                  <TableHead>Events</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {characters.map((character) => (
                  <TableRow key={character.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={character.avatar} alt={character.name} />
                          <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{character.name}</p>
                          <p className="text-sm text-muted-foreground">{character.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{character.owner.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Scroll className="h-4 w-4 text-muted-foreground" />
                        <Link
                          href={`/dashboard/campaigns/${character.campaignId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {character.rpg.name}
                        </Link>
                      </div>
                    </TableCell>
                    {/* <TableCell>{new Date(character.createdAt).toLocaleDateString()}</TableCell> */}
                    <TableCell>{character.events ?? '?'}</TableCell>
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
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/characters/${character.id}`)}>View Character</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(character)}
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
              </TableBody>
            </Table>
          </div>

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
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
            This will permanently delete the character "{characterToDelete?.name}". 
            This action cannot be undone and will remove all associated data.
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

