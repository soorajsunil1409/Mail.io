import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { WavyBackground } from "@/components/ui/wavy-background"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <header className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">EduMail Manager</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="#features">Features</Link>
              </li>
              <li>
                <Link href="#about">About</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex-grow">
          <section className="text-center py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-4xl font-bold mb-4">Manage Your College Emails with AI</h2>
              <p className="text-xl mb-8">Effortlessly organize and prioritize your academic communications</p>
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </motion.div>
          </section>

          <section id="features" className="py-20">
            <h3 className="text-3xl font-bold text-center mb-10">Key Features</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="AI Categorization"
                description="Automatically sort emails into Events, Announcements, and Assignments"
              />
              <FeatureCard
                title="College Email Integration"
                description="Seamlessly connect with your educational institution's email system"
              />
              <FeatureCard
                title="Real-time Updates"
                description="Stay on top of your inbox with periodic email fetching"
              />
            </div>
          </section>

          <section id="about" className="py-20 relative">
            <BackgroundBeams />
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-center mb-10">About EduMail Manager</h3>
              <div className="max-w-2xl mx-auto">
                <TextGenerateEffect words="EduMail Manager is designed to simplify email management for students and faculty. Our AI-powered system helps you focus on what matters most in your academic journey." />
              </div>
            </div>
          </section>
        </main>

        <footer className="text-center p-4">
          <p>&copy; 2023 EduMail Manager. All rights reserved.</p>
        </footer>
      </WavyBackground>
    </div>
  )
}

function FeatureCard({ title, description } : {title: string, description: string}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p>{description}</p>
    </div>
  )
}

