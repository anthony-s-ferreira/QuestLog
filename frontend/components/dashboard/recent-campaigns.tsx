"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ChevronRight, Users } from "lucide-react"
import Link from "next/link"
import { getRPGs } from "@/services/rpgService"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useAuth } from "@/context/AuthContext";

interface RecentCampaignsProps {
  searchQuery: string;
  gmOnly: boolean;
}

export function RecentCampaigns({ searchQuery, gmOnly }: RecentCampaignsProps) {
  const [rpgs, setRPGs] = useState(null);

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
      const fetchData = async () => {
        try {
          let rpgs = await getRPGs();
          if (gmOnly) {
            rpgs = rpgs.filter((rpg) => rpg.master.id === user.id);
          }
          if (searchQuery) {
            rpgs = rpgs.filter((rpg) => rpg.name.toLowerCase().includes(searchQuery.toLowerCase()));
          }
          setRPGs(rpgs);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [searchQuery, gmOnly]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div> : rpgs.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{campaign.name}</CardTitle>
              <Badge variant={campaign.active === true ? "default" : "secondary"}>{campaign.active ? 'Active' : 'Hiatus'}</Badge>
            </div>
            <CardDescription>{campaign.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
                <h3 className="font-medium">Game Master</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" alt={campaign.master.name} />
                    <AvatarFallback>{campaign.master.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{campaign.master.name}</span>
                </div>
              </div>
          </CardContent>
          
          {/* <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{campaign.players} players</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>Last session: {new Date(campaign.lastSession).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent> */}
          <CardFooter>
            <Link href={`/dashboard/campaigns/${campaign.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Campaign
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

