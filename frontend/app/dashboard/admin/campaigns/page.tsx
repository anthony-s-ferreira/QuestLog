"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"
import { ShieldAlert, Search, Plus, MoreHorizontal, Scroll, Users, CalendarDays, Trash } from "lucide-react"
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
import { getAllRPGs } from "@/services/adminService"
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
import { deleteRpg } from "@/services/rpgService"
import { useToast } from "@/hooks/use-toast"


export default function AdminCampaignsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(100)
  const { user, signIn, signOut, isAdmin } = useAuth();
  const [campaigns, setCampaigns] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState(null)
  const { toast } = useToast();

  useEffect(() => {
    const adminCheck = isAdmin()
    setIsAuthorized(adminCheck)

    if (!adminCheck) {
      router.push("/dashboard")
    }
    fetchData()

  }, [router, currentPage])

  const fetchData = async () => {
    const rpgs = await getAllRPGs(currentPage, 10);
    setCampaigns(rpgs)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDelete = (campaign) => {
    setCampaignToDelete(campaign)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
      try {
        await deleteRpg(campaignToDelete.id);
        setCampaigns((prevCampaigns) => prevCampaigns.filter((campaign) => campaign.id !== campaignToDelete.id))
        handleDeleteSuccess()
      } catch {
        
      } finally {
        setIsDeleteDialogOpen(false)
        setCampaignToDelete(null)
      }
    }
  
    const handleDeleteSuccess = () => {
      toast({
        title: "Success",
        description: `Campaign "${campaignToDelete.name}" deleted.`,
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
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Manage all campaigns in the system</p>
        </div>
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Campaign
        </Button> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>View and manage all campaigns in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="flex w-full items-center space-x-2 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
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
                  <TableHead>Campaign</TableHead>
                  <TableHead>Game Master</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead>Created</TableHead> */}
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
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{campaign.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg" alt={campaign.master.name} />
                          <AvatarFallback>{campaign.master.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{campaign.master.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={campaign.active ? "default" : "secondary"}>{campaign.active ? 'Active' : 'Hiatus'}</Badge>
                    </TableCell>
                    {/* <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell> */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.players ?? '?'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.events ?? '?'}</span>
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
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                        >
                          View Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDelete(campaign)}
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
            This will permanently delete the campaign "{campaignToDelete?.name}". 
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

