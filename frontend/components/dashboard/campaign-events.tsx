import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getRPGEventsById } from "@/services/rpgService"

interface CampaignEventsProps {
  campaignId: number
}

export function CampaignEvents({ campaignId }: CampaignEventsProps) {

  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage])

  const fetchEvents = async (page: number) => {
    try {
      setLoading(true);
      const response = await getRPGEventsById(campaignId, page, itemsPerPage);
      setEvents(response); 
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  

  const getLoading = () => {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div>
  }

  return (
    <div className="space-y-4">
      {loading ? getLoading() : events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{event.description}</CardTitle>
              <Badge>{event.type.name}</Badge>
            </div>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={event.character} />
                  <AvatarFallback>{event.character.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{event.character.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(event.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/dashboard/events/${event.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Event Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
      ))}
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-2" />
          Previous
        </Button>
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          variant="outline" 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="ml-2" />
        </Button>
  </div>  
    </div>
  )
}

