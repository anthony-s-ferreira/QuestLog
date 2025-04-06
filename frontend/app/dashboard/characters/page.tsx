"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Users } from "lucide-react"
import Link from "next/link"
import { YourCharacters } from "@/components/dashboard/your-characters"
import { getCharacters } from "@/services/characterService"
import { getRPGs } from "@/services/rpgService"

export default function CharactersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [campaignFilter, setCampaignFilter] = useState(0)

  const [campaigns, setCampaigns] = useState(null);
  const [totalCharacters, setTotalCharacters] = useState(null);
  const [totalActiveCharacters, setActiveTotalCharacters] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const characters = await getCharacters();
          const rpgs = await getRPGs();
          setCampaigns(rpgs);
          setTotalCharacters(characters.length);
          setActiveTotalCharacters(characters.filter((character) => character.rpg.active).length);
          
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
        <h1 className="text-3xl font-bold tracking-tight">Characters</h1>
        <Link href="/dashboard/characters/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Character
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Characters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Your Characters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div> : totalCharacters}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Characters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div> : totalActiveCharacters}</div>
            <p className="text-xs text-muted-foreground">In active campaigns</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full items-center space-x-2 md:w-1/2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="flex flex-1">
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={0} >All Campaigns</SelectItem>
              {loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div>  : campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <YourCharacters searchQuery={searchQuery} rpgId={campaignFilter} />
    </div>
  )
}

