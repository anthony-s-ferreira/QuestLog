"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"
import { ShieldAlert, Users, Scroll, User, CalendarDays, BookOpen, BarChart } from "lucide-react"
import Link from "next/link"
import { getAllCharacters, getAllEvents, getAllRPGs, getAllUsers } from "@/services/adminService"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const { user, signIn, signOut, isAdmin } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalCampaigns, setTotalCampaigns] = useState(0)
  const [totalCharacters, setTotalCharacters] = useState(0)
  const [totalEvents, setTotalEvents] = useState(0)

  useEffect(() => {
    // Check if user is admin
    const adminCheck = isAdmin()
    setIsAuthorized(adminCheck)

    if (!adminCheck) {
      // Redirect to dashboard if not admin
      router.push("/dashboard")
    }

    fetchData();
  }, [router])

  const fetchData = async () => {
    const users = await getAllUsers(1, 1000000);
    const rpgs = await getAllRPGs(1, 1000000);
    const events = await getAllEvents(1, 1000000);
    const chars = await getAllCharacters(1, 1000000);

    setTotalCampaigns(rpgs.length);
    setTotalUsers(users.length);
    setTotalEvents(events.length);
    setTotalCharacters(chars.length);
  };

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
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Scroll className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Characters</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCharacters}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {/* <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>User activity over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <BarChart className="h-16 w-16 text-muted-foreground" />
            <span className="ml-4 text-muted-foreground">Activity chart will be displayed here</span>
          </CardContent>
        </Card> */}
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
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

