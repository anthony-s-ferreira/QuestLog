"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { useToast } from "@/hooks/use-toast"
import { deleteUser, updateUser } from "@/services/userService"
import { useAuth } from "@/context/AuthContext"
import {
  CalendarDays,
  Pencil,
  Save,
  Shield,
  Trash,
  User,
  KeyRound,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Clock,
  Loader2,
} from "lucide-react"

export default function ProfilePage() {
  const { user, fetchUser, isAdmin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  // const [bio, setBio] = useState("")
  const [userType, setUserType] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false)
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      // setBio(
      //   user.bio ||
      //     "Tabletop RPG enthusiast and avid storyteller. I've been playing D&D for over 5 years and enjoy both being a player and game master."
      // )
      setUserType(user.type)
    }
  }, [user])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateUser(user.id, { name: name, email: email, password: 'a', type: userType })
      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "success",
      })
      await fetchUser()
      setIsEditing(false)
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error updating user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = () => {
    setIsChangingPassword(true)

    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive",
      })
      setIsChangingPassword(false)
      return
    }

    if (!newPassword) {
      toast({
        title: "Error",
        description: "New password is required",
        variant: "destructive",
      })
      setIsChangingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      setIsChangingPassword(false)
      return
    }

    // Simulação de chamada API para alteração de senha
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your password has been updated successfully",
        variant: "success",
      })
      setIsChangingPassword(false)
      setIsChangePasswordDialogOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 1500)
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive",
      })
      setIsDeleting(false)
      return
    }

    // Simulação de chamada API para deleção de conta
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted",
      variant: "destructive",
    })
    console.log(user.id)
    await deleteUser(user.id);
    setIsDeleting(false)
    setIsDeleteAccountDialogOpen(false)
    router.push("/logout")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={isLoading}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Profile Picture Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src="/placeholder.svg" alt={user.name} />
              <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
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
              <span className="text-sm">{isAdmin() ? "Administrator" : "Player"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Member since January 2023</span>
            </div>
            {isAdmin() && (
              <Badge className="mt-2 bg-yellow-600 hover:bg-yellow-700">
                <Shield className="mr-1 h-3 w-3" />
                Admin
              </Badge>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                ) : (
                  <div className="rounded-md border p-2">{name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                  />
                ) : (
                  <div className="rounded-md border p-2">{email}</div>
                )}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                ) : (
                  <div className="rounded-md border p-2 whitespace-pre-wrap">{bio}</div>
                )}
              </div> */}
              {isEditing && (
                <div className="space-y-2">
                  <Label>User Type</Label>
                  <RadioGroup value={userType} onValueChange={setUserType} className="flex gap-4">
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
              )}
            </CardContent>
          </Card>

          {/* Account Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account security and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-medium">Password & Security</h3>
                <p className="text-sm text-muted-foreground">
                  It's a good idea to use a strong password that you don't use elsewhere
                </p>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setIsChangePasswordDialogOpen(true)}
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => setIsDeleteAccountDialogOpen(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Optional: Tabs for Stats & Recent Activity */}
          {/* <Tabs defaultValue="stats" className="space-y-4">
            <TabsList>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Campaigns</p>
                      <p className="text-2xl font-bold">4</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Characters</p>
                      <p className="text-2xl font-bold">6</p>
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
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Created a new character</p>
                        <p className="text-xs text-muted-foreground">Thorne Ironheart in The Forgotten Realms</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Logged a new event</p>
                        <p className="text-xs text-muted-foreground">Battle with the Dragon in The Forgotten Realms</p>
                        <p className="text-xs text-muted-foreground">5 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Joined a new campaign</p>
                        <p className="text-xs text-muted-foreground">Star Wars: Edge of the Empire</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs> */}
        </div>
      </div>

      {/* Change Password Dialog */}
      <AlertDialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your current password and a new password below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangePassword} disabled={isChangingPassword}>
              {isChangingPassword ? "Changing..." : "Change Password"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-destructive/10 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-destructive">Attention required</h3>
                  <div className="mt-2 text-sm text-destructive/80">
                    <p>You will lose all your data, including:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>All your characters</li>
                      <li>All campaigns you've created</li>
                      <li>All events and notes you've recorded</li>
                      <li>Your account settings and preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">
                Please type <span className="font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
