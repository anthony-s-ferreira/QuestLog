"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Plus, Search } from "lucide-react"
import Link from "next/link"
import { EventList } from "@/components/dashboard/event-list"

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [eventType, setEventType] = useState("all")
  const [campaignFilter, setCampaignFilter] = useState("all")

  // This would normally fetch data from the API
  const eventTypes = [
    { id: "1", name: "Combat" },
    { id: "2", name: "Roleplay" },
    { id: "3", name: "Discovery" },
    { id: "4", name: "Skill Challenge" },
    { id: "5", name: "Adventure" },
    { id: "6", name: "Other" },
  ]

  const campaigns = [
    { id: "1", title: "The Forgotten Realms" },
    { id: "2", title: "Curse of Strahd" },
    { id: "3", title: "Cyberpunk Red" },
    { id: "4", title: "Star Wars: Edge of the Empire" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">132</div>
            <p className="text-xs text-muted-foreground">+32 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">In the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Most Active Campaign</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">The Forgotten Realms</div>
            <p className="text-xs text-muted-foreground">48 events recorded</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full items-center space-x-2 md:w-1/3">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            icon={Search}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="my-characters">My Characters</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <EventList searchQuery={searchQuery} eventTypeFilter={eventType} campaignFilter={campaignFilter} />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <EventList
            searchQuery={searchQuery}
            eventTypeFilter={eventType}
            campaignFilter={campaignFilter}
            recentOnly={true}
          />
        </TabsContent>
        <TabsContent value="my-characters" className="space-y-4">
          <EventList
            searchQuery={searchQuery}
            eventTypeFilter={eventType}
            campaignFilter={campaignFilter}
            myCharactersOnly={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

