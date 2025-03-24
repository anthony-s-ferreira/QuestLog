"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"
import { ShieldAlert, Search, Plus, MoreHorizontal, Scroll, Users, CalendarDays } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
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

export default function AdminCampaignsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(4)
  const { user, signIn, signOut, isAdmin } = useAuth();

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
  const campaigns = [
    {
      id: 1,
      title: "The Forgotten Realms",
      description: "A high fantasy campaign set in the world of Faerûn.",
      master: "John Smith",
      masterId: 1,
      status: "active",
      createdAt: "2023-01-15",
      players: 5,
      characters: 5,
      events: 48,
    },
    {
      id: 2,
      title: "Curse of Strahd",
      description: "Gothic horror adventure in the mist-shrouded land of Barovia.",
      master: "Michael Williams",
      masterId: 3,
      status: "active",
      createdAt: "2023-03-22",
      players: 4,
      characters: 4,
      events: 36,
    },
    {
      id: 3,
      title: "Cyberpunk Red",
      description: "Dystopian future adventure in Night City.",
      master: "Alex Rodriguez",
      masterId: 5,
      status: "hiatus",
      createdAt: "2023-05-10",
      players: 3,
      characters: 3,
      events: 24,
    },
    {
      id: 4,
      title: "Star Wars: Edge of the Empire",
      description: "Adventure in the Outer Rim of the galaxy.",
      master: "John Smith",
      masterId: 1,
      status: "active",
      createdAt: "2023-02-18",
      players: 6,
      characters: 6,
      events: 42,
    },
    {
      id: 5,
      title: "Shadows of Eldoria",
      description: "A dark fantasy campaign in a world of ancient magic.",
      master: "Michael Williams",
      masterId: 3,
      status: "active",
      createdAt: "2023-04-05",
      players: 4,
      characters: 4,
      events: 18,
    },
  ]

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // This would normally fetch data for the new page
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
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Manage all campaigns in the system</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>View and manage all campaigns in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
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
                  <TableHead>Campaign</TableHead>
                  <TableHead>Game Master</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Scroll className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{campaign.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{campaign.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg" alt={campaign.master} />
                          <AvatarFallback>{campaign.master.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{campaign.master}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.players}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.events}</span>
                      </div>
                    </TableCell>
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
                          <DropdownMenuItem>View Campaign</DropdownMenuItem>
                          <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                          <DropdownMenuItem>Manage Players</DropdownMenuItem>
                          <DropdownMenuItem>
                            {campaign.status === "active" ? "Set to Hiatus" : "Set to Active"}
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
    </div>
  )
}

