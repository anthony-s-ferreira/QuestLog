"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"
import { ShieldAlert, Users, Scroll, User, CalendarDays, BookOpen, BarChart } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
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
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all aspects of the QuestLog platform</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Scroll className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Characters</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">243</div>
            <p className="text-xs text-muted-foreground">+32 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,024</div>
            <p className="text-xs text-muted-foreground">+156 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>User activity over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <BarChart className="h-16 w-16 text-muted-foreground" />
            <span className="ml-4 text-muted-foreground">Activity chart will be displayed here</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/admin/campaigns">
              <Button variant="outline" className="w-full justify-start">
                <Scroll className="mr-2 h-4 w-4" />
                Manage Campaigns
              </Button>
            </Link>
            <Link href="/dashboard/admin/characters">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Manage Characters
              </Button>
            </Link>
            <Link href="/dashboard/admin/events">
              <Button variant="outline" className="w-full justify-start">
                <CalendarDays className="mr-2 h-4 w-4" />
                Manage Events
              </Button>
            </Link>
            <Link href="/dashboard/admin/event-types">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Event Types
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent-users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent-users">Recent Users</TabsTrigger>
          <TabsTrigger value="recent-campaigns">Recent Campaigns</TabsTrigger>
          <TabsTrigger value="recent-events">Recent Events</TabsTrigger>
        </TabsList>
        <TabsContent value="recent-users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Joined Users</CardTitle>
              <CardDescription>New users who joined in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">sarah.johnson@example.com</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Michael Williams</p>
                      <p className="text-sm text-muted-foreground">michael.williams@example.com</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">3 days ago</p>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Emily Davis</p>
                      <p className="text-sm text-muted-foreground">emily.davis@example.com</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">5 days ago</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Link href="/dashboard/admin/users">
                  <Button variant="outline" size="sm">
                    View All Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent-campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Created Campaigns</CardTitle>
              <CardDescription>Campaigns created in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <Scroll className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Shadows of Eldoria</p>
                      <p className="text-sm text-muted-foreground">Created by John Smith</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <Scroll className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Cybernetic Uprising</p>
                      <p className="text-sm text-muted-foreground">Created by Alex Rodriguez</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">3 days ago</p>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Scroll className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Galactic Frontiers</p>
                      <p className="text-sm text-muted-foreground">Created by Sarah Johnson</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">6 days ago</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Link href="/dashboard/admin/campaigns">
                  <Button variant="outline" size="sm">
                    View All Campaigns
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent-events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Logged Events</CardTitle>
              <CardDescription>Events logged in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">The Great Heist</p>
                      <p className="text-sm text-muted-foreground">Shadows of Eldoria • Combat</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Meeting with the Oracle</p>
                      <p className="text-sm text-muted-foreground">The Forgotten Realms • Roleplay</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">8 hours ago</p>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hacking the Mainframe</p>
                      <p className="text-sm text-muted-foreground">Cyberpunk Red • Skill Challenge</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">12 hours ago</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Link href="/dashboard/admin/events">
                  <Button variant="outline" size="sm">
                    View All Events
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

