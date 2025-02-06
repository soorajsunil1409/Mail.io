"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
// import { useQuery } from "react-query"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// const fetchEmails = async () => {
//   const res = await fetch("/api/emails")
//   if (!res.ok) throw new Error("Failed to fetch emails")
//   return res.json()
// }

export default function Dashboard() {
  const { data: session } = useSession()
//   const {
//     data: emails,
//     isLoading,
//     error,
//   } = useQuery("emails", fetchEmails, {
//     refetchInterval: 60000, // Refetch every minute
//   })

  const [selectedCategory, setSelectedCategory] = useState("All")

//   const filteredEmails = emails?.filter((email) => selectedCategory === "All" || email.category === selectedCategory)

//   if (isLoading) return <div>Loading...</div>
//   if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Email Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span>{session?.user?.email}</span>
          <Avatar>
            {/* <AvatarImage src={session?.user?.image} alt={session?.user?.name} /> */}
            <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <Tabs defaultValue="All" className="mb-8">
        <TabsList>
          <TabsTrigger value="All" onClick={() => setSelectedCategory("All")}>
            All
          </TabsTrigger>
          <TabsTrigger value="Events" onClick={() => setSelectedCategory("Events")}>
            Events
          </TabsTrigger>
          <TabsTrigger value="Announcements" onClick={() => setSelectedCategory("Announcements")}>
            Announcements
          </TabsTrigger>
          <TabsTrigger value="Assignments" onClick={() => setSelectedCategory("Assignments")}>
            Assignments
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* {filteredEmails?.map((email) => (
          <motion.div key={email.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>{email.subject}</CardTitle>
                <CardDescription>{email.sender}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{email.body}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-gray-500">{new Date(email.receivedAt).toLocaleString()}</span>
                <Button variant="outline">{email.category}</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))} */}
      </div>
    </div>
  )
}

