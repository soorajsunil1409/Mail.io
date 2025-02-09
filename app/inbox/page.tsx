"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Mail, MailOpen, Star, Trash, Send, Archive, Search, RefreshCw, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate } from "@/utils/formatDate"
import { toast } from "@/hooks/use-toast"
import NewCategoryModal from "@/components/NewCategoryModal"
import { IntegerType } from "mongodb"

interface IEmail {
  snippet: string
  headers: {
    from: string
    date: string
    subject: string
  }
  category: string
  message_id: string
}

interface ICategory {
  name: string,
  description: string
}

export default function Inbox() {
  const { theme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)
  const { data: session, status } = useSession()

  const [emails, setEmails] = useState<IEmail[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [prevPageToken, setPrevPageToken] = useState<string>("");
  const [nextPageToken, setNextPageToken] = useState<string>("");
  const [currentPageToken, setCurrentPageToken] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<IntegerType>(1);

  const [isNewCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getEmails = async () => {
    if (status !== "authenticated" || !session?.user?.id) return

    setIsSyncing(true)
    try {
      const res = await fetch(`/api/get/emails?user_id=${session.user.id}`, {
        method: "GET",
      })

      if (!res.ok) {
        throw new Error("Failed to fetch emails")
      }

      const data = await res.json()
      setEmails(data.messages)
      setNextPageToken(data.next_page_token);
      console.log(data.next_page_token);
      toast({
        title: "Emails synced successfully",
        description: `${data.messages.length} emails retrieved.`,
      })
    } catch (error) {
      console.error("Error fetching emails:", error)
      toast({
        title: "Sync failed",
        description: "There was an error syncing your emails. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  };

  const handleAddCategory = async (newCategory: {name: string, description: string}) => {
    if (status !== "authenticated" || !session?.user?.id) return

    console.log(newCategory);

    try {
      const res = await fetch(`/api/category/update`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          user_id: session?.user?.id,
          categories: [...categories, newCategory]
        })
      });

      if (!res.ok) {
        console.log("Update Categories Failed");
      }

      setCategories([...categories, newCategory]);
      setIsCategoryModalOpen(false);

    } catch (error) {
      console.log("Error updating Categories");
    }
  }

  const handleRemoveCategory = async (name: string) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
    
    if (!isConfirmed) return;

    const newCategories = categories.filter((category) => category.name !== name);

    console.log(newCategories);
    
    try {
      const res = await fetch(`/api/category/update`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          user_id: session?.user?.id,
          categories: newCategories
        })
      });

      if (!res.ok) {
        console.log("Delete Categories Failed");
      }

      setCategories(newCategories);
    } catch (error) {
        console.log("Error deleting Categories");
      }
  }

  const handlePrevPage = async () => {
    
  }

  const handleNextPage = async () => {
    
  }

  useEffect(() => {
    const getCategories = async () => {
      if (status !== "authenticated" || !session?.user?.id) return
      
      try {
        const res = await fetch(`/api/category/get?user_id=${session?.user?.id}`, {
          method: "GET"
        });

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        if (data) {
          setCategories([...data.categories]);
          console.log(data.categories);
        }

      } catch (error) {
        console.log("Error getting categories");
      }
    };

    getCategories();
  }, [session, status])


//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.id) {
//       getEmails()
//     }
//   }, [status, session, getEmails]) // Added getEmails to dependencies

  const filteredEmails = emails.filter(
    (email) =>
      (selectedCategory === "All" || email.category === selectedCategory) &&
      (email.headers.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.headers.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.snippet.toLowerCase().includes(searchTerm.toLowerCase())),
  )

    // const filteredEmails = [
    //     {
    //         "snippet": "Dear all, Due to Winter intra weekend classes on Sunday (09/02/2025), buses will be operated as per the attached schedule. Note: No Shuttle services in the afternoon. Evening dispersal of all buses",
    //         "headers": {
    //             "received": [
    //                 "by 2002:a05:6400:bd8:b0:289:1c4a:6c4b with SMTP id jh24csp145915ecb;        Fri, 7 Feb 2025 18:46:48 -0800 (PST)",
    //                 "from mail-sor-f69.google.com (mail-sor-f69.google.com. [209.85.220.69])        by mx.google.com with SMTPS id 6a1803df08f44-6e45237cb96sor948816d6.0.2025.02.07.18.46.47        for <sooraj.snamboothiry2023@vitstudent.ac.in>        (Google Transport Security);        Fri, 07 Feb 2025 18:46:47 -0800 (PST)",
    //                 "by 2002:a05:6214:a45:b0:6d9:1375:552e with SMTP id 6a1803df08f44-6e444f8d7aals22232366d6.0.-pod-prod-06-us; Fri, 07 Feb 2025 18:46:45 -0800 (PST)",
    //                 "by 2002:a05:6214:a45:b0:6d9:1375:552e with SMTP id 6a1803df08f44-6e444f8d7aals22231056d6.0.-pod-prod-06-us; Fri, 07 Feb 2025 18:46:43 -0800 (PST)",
    //                 "from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41])        by mx.google.com with SMTPS id 6a1803df08f44-6e4514d571csor7270376d6.1.2025.02.07.18.46.42        for <allstudents.chennai@vit.ac.in>        (Google Transport Security);        Fri, 07 Feb 2025 18:46:42 -0800 (PST)"
    //             ],
    //             "from": "\"'Transport Manager Chennai' via CSE (Spl. in A I and Machine Learning) 2023 Group, Chennai Campus\" <ccbai23@vitstudent.ac.in>",
    //             "date": "Sat, 8 Feb 2025 08:16:30 +0530",
    //             "subject": "Transport Operation Schedule for 09/02/2025",
    //             "to": "allfirstyear.chennai@vitstudent.ac.in, allstudents.chennai@vit.ac.in, chennai.vitians@vit.ac.in",
    //             "mailing-list": "list ccbai23@vitstudent.ac.in; contact ccbai23+owners@vitstudent.ac.in"
    //         },
    //         "body": "",
    //         "attachments": [
    //             {
    //                 "filename": "INTRA WEEKEND ROUTE DETAILS.xlsx",
    //                 "attachmentId": "ANGjdJ91D7O2T-vDO30-yv5RTKVc9W0Htn9-gSqzaio9ep8dzfvPD3hTvX9wHswShSD5BWgeWCUIXAV4LilPflfUVrAeJyetQ5DQZB3fOUjgZX16tLs-an8MWKHtVDVpI2Dy7y1JLqzr3RtWsNkhj2ejKeb3p0NTL_2gTfpgWXfHRebU0_ehx7AYjd6LSDJL-H4d1fF56ORq0AJpxpiXKs6ZwlVWX_WMOTkAxgdyACAUe9yFg-M4ZOP8RMcrJJc3fn8JFgB0I3IgukilmhQ6BcM_FSDRywO6TK1VTWCFr8ITuVkvO013VQXrTte6ntJCeY7ILsuFecn4Xty5QiVMbT3AbNutobU2UGCFP1Ll8pEitHSh0hJ2-BzIe7nrUgA4mFZc7RavYYgH0EfaPfSr"
    //             }
    //         ],
    //         "category": "Important",
    //         "message_id": "194e373d8dc3c8dc"
    //     },
    // ]

  return (
    <div className="px-8 w-full h-[88vh] flex flex-col gap-10 items-center pb-10 bg-gradient-to-br from-background to-secondary">
      <div className="w-full pt-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold mb-2">Email Inbox</h1>
        </div>
        <Button
          onClick={getEmails}
          disabled={isSyncing || status !== "authenticated"}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Emails"}
        </Button>
      </div>

      <div className="w-full flex gap-8">
        <Card className="w-64 h-[calc(94vh-200px)]">
          <CardContent className="p-4">
            <Button className="w-full mb-4" variant="default">
              Compose
            </Button>
            <ScrollArea className="h-[calc(100%-60px)]">
              <button
                className="w-full justify-start mb-2 relative group flex items-center p-3 hover:bg-secondary rounded-md text-sm"
                onClick={() => setSelectedCategory("All")}
              >
                All
              </button>
              {categories.map((category, index) => (
                <button
                key={index}
                className="w-full justify-start mb-2 relative group flex items-center p-3 hover:bg-secondary rounded-md text-sm"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}

                {hoveredIndex === index && (
                  <Trash2
                    className="absolute right-2 top-2 text-gray-500 translate-y-1 hover:text-red-500 cursor-pointer transition-all"
                    size={20}
                    onClick={() => handleRemoveCategory(category.name)}
                  />
                )}
              </button>
              ))}
              <Button onClick={() => setIsCategoryModalOpen((prev) => !prev)} className="w-full justify-start mb-2 bg-background border-dashed border-2 border-contrast/60 text-contrast hover:bg-secondary">Add Category</Button>

              {
                isNewCategoryModalOpen &&
                <NewCategoryModal handleAddCategory={handleAddCategory} />
              }
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[calc(94vh-200px)] w-full overflow-scroll">
          <CardContent className="p-4 w-full">
            <div className="flex items-center space-x-2 mb-4 w-full">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="h-[calc(100%-60px)] w-full">
              {filteredEmails.map((email) => (
                <div
                  key={email.message_id}
                  className="flex items-center space-x-4 p-4 hover:bg-muted w-full rounded-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {email.headers.from.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{email.headers.from}</p>
                    <p className="text-sm font-medium truncate">{email.headers.subject}</p>
                    <p className="text-sm text-muted-foreground truncate">{email.snippet}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{formatDate(email.headers.date)}</p>
                    <Badge variant="secondary" className="mt-1">
                      {email.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

