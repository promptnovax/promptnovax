import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BuyerSubscriptions } from "@/components/buyer/BuyerSubscriptions"
import { BuyerInvoices } from "@/components/buyer/BuyerInvoices"
import { BuyerDownloads } from "@/components/buyer/BuyerDownloads"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  BellRing,
  CalendarClock,
  CreditCard,
  Orbit,
  Rocket,
  SwitchCamera,
  Wallet
} from "lucide-react"

const addOns = [
  {
    title: "Prompt refresh automation",
    description: "Auto-pull updated prompt versions every sprint and schedule QA.",
    price: "$12/mo",
    status: "Recommended"
  },
  {
    title: "Team seats boost",
    description: "Add 5 buyer researchers with shared workspace and approvals.",
    price: "$25/mo",
    status: "Popular"
  }
]

const renewals = [
  { label: "Pro updates bundle", date: "Feb 10", amount: "$49.00", status: "Due soon" },
  { label: "Prompt testing add-on", date: "Feb 2", amount: "$24.00", status: "Trial" },
  { label: "Creative studio premium", date: "Mar 1", amount: "$89.00", status: "Active" }
]

export function BuyerSubscriptionsPage() {
  const { success } = useToast()
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false)
  const [cardLastFour, setCardLastFour] = useState("4242")
  const [cardExpiry, setCardExpiry] = useState("08/27")
  const [licenseSeats, setLicenseSeats] = useState("5 seats")
  const [licenseNotes, setLicenseNotes] = useState("")

  const handleCalendarExport = () => {
    const ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PNX//Subscriptions//EN\nEND:VCALENDAR"
    const blob = new Blob([ics], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "pnx-renewals.ics")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success("Calendar ready", "Import the ICS file into your calendar tool.")
  }

  const handleSavePayment = () => {
    success("Payment updated", `Card •••• ${cardLastFour} saved.`)
    setPaymentDialogOpen(false)
  }

  const handleAddLicense = () => {
    success("License requested", `${licenseSeats} queued for activation.`)
    setLicenseDialogOpen(false)
    setLicenseNotes("")
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <Orbit className="h-6 w-6 text-primary" />
              Subscriptions & renewals
            </h1>
            <p className="text-muted-foreground">
              Track every subscription, automate renewals and keep billing ready for finance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPaymentDialogOpen(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Update payment methods
            </Button>
            <Button onClick={() => setLicenseDialogOpen(true)}>
              <Rocket className="h-4 w-4 mr-2" />
              Add new license
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active subscriptions</CardDescription>
            <CardTitle className="text-3xl">6</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <BellRing className="h-4 w-4 text-primary" />
            2 renewals due within 7 days
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly recurring</CardDescription>
            <CardTitle className="text-3xl">$132</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4 text-green-500" />
            Includes automation add-ons
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Seats in use</CardDescription>
            <CardTitle className="text-3xl">18 / 20</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <SwitchCamera className="h-4 w-4 text-amber-500" />
            Auto scale limit when 90% utilized
          </CardContent>
        </Card>
      </div>

      <BuyerSubscriptions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Renewal calendar</CardTitle>
            <CardDescription>Sync with your ops calendar in one click</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renewals.map((renewal) => (
              <div key={renewal.label} className="rounded-xl border p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{renewal.label}</div>
                  <p className="text-sm text-muted-foreground">Renews {renewal.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{renewal.amount}</p>
                  <Badge variant={renewal.status === "Due soon" ? "destructive" : "secondary"}>
                    {renewal.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={handleCalendarExport}>
              <CalendarClock className="h-4 w-4 mr-2" />
              Export to calendar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization ideas</CardTitle>
            <CardDescription>Upsize what’s working, pause what isn’t</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {addOns.map((item) => (
              <div key={item.title} className="rounded-xl bg-muted/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.title}</p>
                  <Badge>{item.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.price}</span>
                  <Button size="sm" variant="outline" onClick={() => window.location.hash = "#pricing"}>
                    Compare plan
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BuyerDownloads />
        <BuyerInvoices />
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update payment method</DialogTitle>
            <DialogDescription>We store two cards for redundancy. Changes take effect immediately.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="card-last4">Card last four</Label>
              <Input id="card-last4" value={cardLastFour} onChange={(e) => setCardLastFour(e.target.value)} maxLength={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-expiry">Expiry</Label>
              <Input id="card-expiry" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button disabled={cardLastFour.length !== 4} onClick={handleSavePayment}>Save method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={licenseDialogOpen} onOpenChange={setLicenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add license bundle</DialogTitle>
            <DialogDescription>Provision new seats instantly and notify finance.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Seat bundle</Label>
              <Select value={licenseSeats} onValueChange={setLicenseSeats}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5 seats">5 seats</SelectItem>
                  <SelectItem value="10 seats">10 seats</SelectItem>
                  <SelectItem value="enterprise-unlimited">Enterprise unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="license-notes">Notes</Label>
              <Input id="license-notes" value={licenseNotes} onChange={(e) => setLicenseNotes(e.target.value)} placeholder="Team, cost center, or urgency" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setLicenseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLicense}>Submit request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

