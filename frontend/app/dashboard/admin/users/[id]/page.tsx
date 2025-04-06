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
import { useParams, useRouter } from "next/navigation"
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
import { getUserById } from "@/services/adminService"
import { updateUser } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: ""
  })
  const { toast } = useToast();
  useEffect(() => {
    // Check if user is admin
    const adminCheck = isAdmin()
    setIsAuthorized(adminCheck)

    if (!adminCheck) {
      router.push("/dashboard")
      return
    }
    getUserData(Number(id));
  }, [id, router])

  const getUserData = async (id: number) => {
    const user = await getUserById(id);
    setUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      type: user.type,
    })
    setIsLoading(false)
    return user
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (user) {
        setUser({
          ...user,
          name: formData.name,
          email: formData.email
        })
      }
      const updatedUser = await updateUser(Number(id), {name: formData.name, email: formData.email, password: 'a', type: formData.type})
      handleSuccess();
      setIsEditing(false)
    } catch (error) {
      handleError(error);
    } finally {
      setIsSaving(false)
    }
  }

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: `User edited successfully.`,
      variant: "success"
    })
  }

  const handleError = (error) => {
    toast({
      title: "Error",
      description: error.response?.data?.message,
      variant: "destructive"
    })
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
                {user?.type === 'admin' ? "Administrator" :  "Player"}
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
            </div> */}
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
              {/* <div className="space-y-2">
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
              </div> */}
              {isEditing && (
                <>

                </>
              )}
            </CardContent>
          </Card>

          {/* <Tabs defaultValue="stats" className="space-y-4">
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
          </Tabs> */}
        </div>
      </div>

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

