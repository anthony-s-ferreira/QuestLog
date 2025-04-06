"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Scroll, Users } from "lucide-react"
import Link from "next/link"
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
import { getRPGs } from "@/services/rpgService"
import { useAuth } from "@/context/AuthContext"

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [rpgs, setRPGs] = useState(null);
  const [totalActive, setTotalActive] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState(0);

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
      const fetchData = async () => {
        try {
          let rpgs = await getRPGs();
          setTotalCampaigns(rpgs.length);
          setTotalActive(rpgs.filter((rpg) => rpg.active).length);
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <Link href="/dashboard/campaigns/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Scroll className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div> : totalActive}</div>
            {/* <p className="text-xs text-muted-foreground">+2 from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Scroll className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div> : totalActive}</div>
            <p className="text-xs text-muted-foreground">{loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div> : totalCampaigns - totalActive} on hiatus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">feature coming soon!</div>
            {/* <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p> */}
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full items-center space-x-2 mb-4">
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

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="gm">GM Campaigns</TabsTrigger>
          <TabsTrigger value="player">Player Campaigns</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <RecentCampaigns searchQuery={searchQuery} gmOnly={false}  />
        </TabsContent>
        <TabsContent value="gm" className="space-y-4">
          <RecentCampaigns searchQuery={searchQuery} gmOnly={true} />
        </TabsContent>
        <TabsContent value="player" className="space-y-4">
          <RecentCampaigns searchQuery={searchQuery} gmOnly={false} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

