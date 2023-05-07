"use client"

import { useState } from "react"
import Link from "next/link"
import { subYears } from "date-fns"
import { rrulestr } from "rrule"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Calendar from "@/components/calendar"

export default function IndexPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [message, setMessage] = useState("")
  const [dates, setDates] = useState<Date[]>([])

  const parseRRule = () => {
    if (!message) return
    try {
      const rrule = rrulestr(message, {
        dtstart: subYears(new Date(Date.now()), 1),
      })
      const dates = rrule.all()
      setDates(dates)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Take Control of Your <br className="md:hidden" />
            Schedule with Rulify
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Rulify is a new startup that lets you easily view your recurring
            events on a live calendar. Say goodbye to complicated scheduling and
            hello to a smarter way to manage your time. Try Rulify today!
          </p>
        </div>
        <div className="flex gap-4">
          <Dialog open={showDialog}>
            <DialogTrigger asChild>
              <Button
                className={buttonVariants({ size: "lg" })}
                onClick={() => {
                  setShowDialog(true)
                }}
              >
                Get Started
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Paste your RRule String?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                  <div className="mt-4 space-y-6">
                    <Textarea
                      className="w-full"
                      placeholder="Paste your RRule string here"
                      onChange={(e) => {
                        setMessage(e.target.value)
                      }}
                    />
                    <Button
                      className="w-full"
                      onClick={() => {
                        setShowDialog(false)
                        parseRRule()
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            View Github
          </Link>
        </div>
      </section>
      <section className="h-full border-2 p-3">
        <Calendar dates={dates} />
      </section>
    </main>
  )
}
