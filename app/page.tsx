'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, BarChart, Globe, Smartphone, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]" />
      </div>

      <header className="px-6 py-4 flex justify-between items-center border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          LinkShortify
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="space-x-2 hidden sm:block">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6 text-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
              Shorten Your Links, <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Expand Your Reach
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              The most powerful link shortener for modern businesses. Track clicks, manage expiry, and ensure security with our advanced platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 transition-all">
                  Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Lightning Fast",
                desc: "Instant redirection with our global edge network and Redis caching.",
                color: "bg-indigo-500/10 text-indigo-500"
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Secure & Reliable",
                desc: "Enterprise-grade security with JWT authentication and link expiration.",
                color: "bg-purple-500/10 text-purple-500"
              },
              {
                icon: <BarChart className="h-6 w-6" />,
                title: "Real-time Analytics",
                desc: "Track your link performance with real-time click counting.",
                color: "bg-pink-500/10 text-pink-500"
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Global Reach",
                desc: "Links that work everywhere, optimized for every device and region.",
                color: "bg-blue-500/10 text-blue-500"
              },
              {
                icon: <Smartphone className="h-6 w-6" />,
                title: "Mobile First",
                desc: "Manage your links on the go with our fully responsive dashboard.",
                color: "bg-green-500/10 text-green-500"
              },
              {
                icon: <Lock className="h-6 w-6" />,
                title: "Privacy Focused",
                desc: "Your data is encrypted and secure. We prioritize user privacy.",
                color: "bg-orange-500/10 text-orange-500"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={item}
                className="p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <footer className="py-8 text-center text-muted-foreground border-t border-border/40 bg-background/50 backdrop-blur-sm">
        <p>© 2024 LinkShortify. All rights reserved.</p>
      </footer>
    </div>
  )
}
