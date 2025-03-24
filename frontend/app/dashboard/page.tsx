"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Plus, Scroll, Users } from "lucide-react"
import Link from "next/link"
import { getRPGs } from "@/services/rpgService";
import { getCharacters } from "@/services/characterService";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
import { YourCharacters } from "@/components/dashboard/your-characters"
import { RecentEvents } from "@/components/dashboard/recent-events"
import ClipLoader from "react-spinners/ClipLoader";

export default function DashboardPage() {

  const [totalRPGs, setTotalRPGs] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rpgs = await getRPGs();
        const characters = await getCharacters();
        // const events = await getEvents();
  
        setTotalRPGs(rpgs.length);
        setTotalCharacters(characters.length);
        // setTotalEvents(events.length);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/campaigns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Scroll className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div> : totalRPGs}</div>
            {/* <p className="text-xs text-muted-foreground">+2 from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Characters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div> : totalCharacters}</div>
            {/* <p className="text-xs text-muted-foreground">+4 from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">feature coming soon!</div>
            {/* <p className="text-xs text-muted-foreground">+32 from last month</p> */}
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns" className="space-y-4">
          <RecentCampaigns searchQuery={""} gmOnly={false} />
        </TabsContent>
        <TabsContent value="characters" className="space-y-4">
          <YourCharacters rpgId={0} searchQuery={""}/>
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <RecentEvents />
        </TabsContent>
      </Tabs>
    </div>
  )
}

