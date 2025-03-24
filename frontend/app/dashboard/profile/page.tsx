"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Pencil, Save, Shield, User } from "lucide-react"
import { updateUser } from "@/services/userService"
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, AlertTriangle, Info, X, Clock, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, fetchUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setName(user?.name)
    setEmail(user?.email)

    setUserType(user.type)
  }, [])

  const handleSave = async () => {
    setIsLoading(true);
    try {
        await updateUser(user.id, { name, email, password: '', type: userType });
        handleUpdateSuccess();
        await fetchUser();
        setIsEditing(false);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        handleUpdateError(error);
    } finally {
        setIsLoading(false);
    }
  }

  const handleUpdateError = (error: any) => {
    toast({
        title: "Error",
        description: error.response?.data?.message,
        variant: "destructive"
      })
  }

  const handleUpdateSuccess = () => {
    toast({
        title: "Success",
        description: "User updated successfully",
        variant: "success"
    })
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
              <span className="text-sm">
                {isAdmin ? "Administrator" : user.type === "gamemaster" ? "Game Master" : "Player"}
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Member since January 2023</span>
            </div> */}
            {isAdmin && (
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
              <div className="space-y-2">
                  <Label>User Type: {userType}</Label>
                  
                </div>
            </CardContent>
          </Card>

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
    </div>
  )
}

