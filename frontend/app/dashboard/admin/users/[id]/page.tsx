"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"
import { ArrowLeft, CalendarDays, Pencil, Save, Shield, User, Users, Scroll } from "lucide-react"
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
import Link from "next/link"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    status: "",
    bio: "",
    isAdmin: false,
  })

  useEffect(() => {
    // Check if user is admin
    const adminCheck = isAdmin()
    setIsAuthorized(adminCheck)

    if (!adminCheck) {
      // Redirect to dashboard if not admin
      router.push("/dashboard")
      return
    }

    // Fetch user data - in a real app, this would be an API call
    // For now, we'll simulate loading the data
    setTimeout(() => {
      const userData = getUserData(Number.parseInt(params.id))
      setUser(userData)
      setFormData({
        name: userData.name,
        email: userData.email,
        type: userData.type,
        status: userData.status,
        bio:
          userData.bio ||
          "Tabletop RPG enthusiast and avid storyteller. I've been playing D&D for over 5 years and enjoy both being a player and game master.",
        isAdmin: userData.isAdmin,
      })
      setIsLoading(false)
    }, 500)
  }, [params.id, router])

  const getUserData = (id: number): UserType => {
    // This would normally be an API call
    // Mock data for demonstration
    const users = [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        type: "gamemaster",
        isAdmin: true,
        status: "active",
        createdAt: "2023-01-15",
        campaigns: 4,
        characters: 2,
        bio: "Experienced game master with a passion for creating immersive worlds and engaging storylines.",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        type: "player",
        isAdmin: false,
        status: "active",
        createdAt: "2023-03-22",
        campaigns: 0,
        characters: 3,
        bio: "New to tabletop RPGs but loving every minute of it. My favorite character is my elf ranger.",
      },
      {
        id: 3,
        name: "Michael Williams",
        email: "michael.williams@example.com",
        type: "gamemaster",
        isAdmin: false,
        status: "active",
        createdAt: "2023-05-10",
        campaigns: 2,
        characters: 1,
        bio: "Long-time DM who specializes in horror and mystery campaigns.",
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        type: "player",
        isAdmin: false,
        status: "inactive",
        createdAt: "2023-02-18",
        campaigns: 0,
        characters: 4,
        bio: null,
      },
      {
        id: 5,
        name: "Alex Rodriguez",
        email: "alex.rodriguez@example.com",
        type: "gamemaster",
        isAdmin: false,
        status: "active",
        createdAt: "2023-04-05",
        campaigns: 1,
        characters: 2,
        bio: "Sci-fi enthusiast who loves running futuristic campaigns.",
      },
    ]

    return users.find((user) => user.id === id) || users[0]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleAdminToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isAdmin: checked }))
  }

  const handleSave = () => {
    setIsSaving(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      setUser({
        ...user!,
        name: formData.name,
        email: formData.email,
        type: formData.type,
        status: formData.status,
        bio: formData.bio,
        isAdmin: formData.isAdmin,
      })
      setIsSaving(false)
      setIsEditing(false)
    }, 1000)
  }

  const handlePromoteToAdmin = () => {
    setIsPromoteDialogOpen(true)
  }

  const confirmPromoteToAdmin = () => {
    setFormData((prev) => ({ ...prev, isAdmin: true }))
    setIsPromoteDialogOpen(false)
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Shield className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Admin Access Required</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You need administrator privileges to access this page. Please contact your system administrator if you believe
          this is an error.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src="/placeholder.svg" alt={user?.name} />
              <AvatarFallback className="text-4xl">{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button variant="outline" className="mt-2">
                Change Picture
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {user?.isAdmin ? "Administrator" : user?.type === "gamemaster" ? "Game Master" : "Player"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
            {user?.isAdmin && (
              <Badge className="mt-2 bg-yellow-600 hover:bg-yellow-700">
                <Shield className="mr-1 h-3 w-3" />
                Admin
              </Badge>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>View and update user details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full name"
                  />
                ) : (
                  <div className="rounded-md border p-2">{user?.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                  />
                ) : (
                  <div className="rounded-md border p-2">{user?.email}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="User bio"
                    rows={4}
                  />
                ) : (
                  <div className="rounded-md border p-2 whitespace-pre-wrap">{user?.bio}</div>
                )}
              </div>
              {isEditing && (
                <>
                  <div className="space-y-2">
                    <Label>User Type</Label>
                    <RadioGroup value={formData.type} onValueChange={handleTypeChange} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="player" id="player" />
                        <Label htmlFor="player">Player</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gamemaster" id="gamemaster" />
                        <Label htmlFor="gamemaster">Game Master</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <RadioGroup value={formData.status} onValueChange={handleStatusChange} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="active" />
                        <Label htmlFor="active">Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inactive" id="inactive" />
                        <Label htmlFor="inactive">Inactive</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-toggle">Administrator</Label>
                      <Switch id="admin-toggle" checked={formData.isAdmin} onCheckedChange={handleAdminToggle} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Administrators have full access to all features and settings in the system.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="stats" className="space-y-4">
            <TabsList>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="characters">Characters</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Campaigns</p>
                      <p className="text-2xl font-bold">{user?.campaigns}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Characters</p>
                      <p className="text-2xl font-bold">{user?.characters}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Events Logged</p>
                      <p className="text-2xl font-bold">42</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Sessions Attended</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="campaigns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.campaigns > 0 ? (
                    <div className="space-y-4">
                      {user?.type === "gamemaster" && (
                        <div className="rounded-md border">
                          <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Scroll className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">The Forgotten Realms</p>
                                  <p className="text-sm text-muted-foreground">Game Master</p>
                                </div>
                              </div>
                              <Badge>Active</Badge>
                            </div>
                            <div className="mt-2 flex justify-end">
                              <Link href="/dashboard/campaigns/1">
                                <Button variant="outline" size="sm">
                                  View Campaign
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="rounded-md border">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Scroll className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Curse of Strahd</p>
                                <p className="text-sm text-muted-foreground">Player</p>
                              </div>
                            </div>
                            <Badge>Active</Badge>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Link href="/dashboard/campaigns/2">
                              <Button variant="outline" size="sm">
                                View Campaign
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6">
                      <Scroll className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground">This user is not part of any campaigns.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="characters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Characters</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.characters > 0 ? (
                    <div className="space-y-4">
                      <div className="rounded-md border">
                        <div className="p-4 border-b">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>T</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Thorne Ironheart</p>
                              <p className="text-sm text-muted-foreground">Dwarf Paladin, Level 8</p>
                              <p className="text-xs text-muted-foreground">The Forgotten Realms</p>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Link href="/dashboard/characters/1">
                              <Button variant="outline" size="sm">
                                View Character
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border">
                        <div className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>L</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Lyra Moonshadow</p>
                              <p className="text-sm text-muted-foreground">Elf Ranger, Level 6</p>
                              <p className="text-xs text-muted-foreground">Curse of Strahd</p>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Link href="/dashboard/characters/2">
                              <Button variant="outline" size="sm">
                                View Character
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground">This user has no characters.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Promote to Admin Confirmation Dialog */}
      <AlertDialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote to Administrator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to promote {user?.name} to an administrator? This will give them full access to all
              administrative functions in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPromoteToAdmin} className="bg-yellow-600 hover:bg-yellow-700">
              <Shield className="mr-2 h-4 w-4" />
              Promote to Admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Type definition for user
interface UserType {
  id: number
  name: string
  email: string
  type: string
  isAdmin: boolean
  status: string
  createdAt: string
  campaigns: number
  characters: number
  bio: string | null
}

