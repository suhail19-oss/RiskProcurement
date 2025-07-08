<<<<<<< HEAD
// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"
// import {
//   AlertTriangle,
//   Clock,
//   FileX,
//   Shield,
//   CheckCircle,
//   XCircle,
//   Calendar,
//   AlertCircle,
//   Settings,
//   Filter,
// } from "lucide-react"

// const upcomingDeadlines = [
//   {
//     id: 1,
//     title: "GreenTech Solutions - Annual ESG Report",
//     dueDate: "2024-02-15",
//     daysLeft: 12,
//     priority: "high",
//     supplier: "GreenTech Solutions",
//     type: "ESG Report",
//   },
//   {
//     id: 2,
//     title: "EcoManufacturing Co - Carbon Footprint Assessment",
//     dueDate: "2024-02-20",
//     daysLeft: 17,
//     priority: "medium",
//     supplier: "EcoManufacturing Co",
//     type: "Environmental",
//   },
//   {
//     id: 3,
//     title: "SustainableParts Inc - Labor Standards Certification",
//     dueDate: "2024-02-25",
//     daysLeft: 22,
//     priority: "medium",
//     supplier: "SustainableParts Inc",
//     type: "Social",
//   },
//   {
//     id: 4,
//     title: "CleanEnergy Corp - Governance Policy Update",
//     dueDate: "2024-03-01",
//     daysLeft: 26,
//     priority: "low",
//     supplier: "CleanEnergy Corp",
//     type: "Governance",
//   },
// ]

// const missingDocuments = [
//   {
//     id: 1,
//     supplier: "BudgetSupply Ltd",
//     document: "Environmental Policy Statement",
//     category: "Environmental",
//     overdueDays: 5,
//     lastReminder: "2024-01-25",
//   },
//   {
//     id: 2,
//     supplier: "SustainableParts Inc",
//     document: "Diversity & Inclusion Report",
//     category: "Social",
//     overdueDays: 12,
//     lastReminder: "2024-01-20",
//   },
//   {
//     id: 3,
//     supplier: "TechComponents LLC",
//     document: "Board Independence Declaration",
//     category: "Governance",
//     overdueDays: 3,
//     lastReminder: "2024-01-28",
//   },
// ]

// const riskAlerts = [
//   {
//     id: 1,
//     supplier: "GlobalManufacturing Inc",
//     alert: "Regulatory compliance score dropped below threshold",
//     severity: "critical",
//     category: "Compliance",
//     detectedDate: "2024-01-30",
//     impact: "High",
//   },
//   {
//     id: 2,
//     supplier: "EcoManufacturing Co",
//     alert: "Carbon emissions increased by 15% this quarter",
//     severity: "warning",
//     category: "Environmental",
//     detectedDate: "2024-01-28",
//     impact: "Medium",
//   },
//   {
//     id: 3,
//     supplier: "SustainableParts Inc",
//     alert: "Employee safety incidents reported",
//     severity: "warning",
//     category: "Social",
//     detectedDate: "2024-01-26",
//     impact: "Medium",
//   },
//   {
//     id: 4,
//     supplier: "TechComponents LLC",
//     alert: "Financial transparency concerns identified",
//     severity: "medium",
//     category: "Governance",
//     detectedDate: "2024-01-24",
//     impact: "Low",
//   },
// ]

// const notificationSettings = [
//   {
//     id: "deadlines",
//     title: "Upcoming Deadlines",
//     description: "Get notified about approaching submission deadlines",
//     enabled: true,
//     frequency: "daily",
//   },
//   {
//     id: "missing-docs",
//     title: "Missing Documents",
//     description: "Alerts for overdue or missing supplier documents",
//     enabled: true,
//     frequency: "weekly",
//   },
//   {
//     id: "risk-alerts",
//     title: "Risk Alerts",
//     description: "Critical risk notifications and compliance issues",
//     enabled: true,
//     frequency: "immediate",
//   },
//   {
//     id: "score-changes",
//     title: "Score Changes",
//     description: "Notifications when supplier ESG scores change significantly",
//     enabled: false,
//     frequency: "weekly",
//   },
//   {
//     id: "new-suppliers",
//     title: "New Supplier Registrations",
//     description: "Alerts when new suppliers register on the platform",
//     enabled: true,
//     frequency: "daily",
//   },
// ]

// function getPriorityColor(priority: string) {
//   switch (priority) {
//     case "high":
//       return "text-red-600 bg-red-100 dark:bg-red-900/20"
//     case "medium":
//       return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
//     case "low":
//       return "text-green-600 bg-green-100 dark:bg-green-900/20"
//     default:
//       return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
//   }
// }

// function getSeverityColor(severity: string) {
//   switch (severity) {
//     case "critical":
//       return "text-red-600 bg-red-100 dark:bg-red-900/20"
//     case "warning":
//       return "text-orange-600 bg-orange-100 dark:bg-orange-900/20"
//     case "medium":
//       return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
//     default:
//       return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
//   }
// }

// function getSeverityIcon(severity: string) {
//   switch (severity) {
//     case "critical":
//       return <XCircle className="h-4 w-4" />
//     case "warning":
//       return <AlertTriangle className="h-4 w-4" />
//     case "medium":
//       return <AlertCircle className="h-4 w-4" />
//     default:
//       return <CheckCircle className="h-4 w-4" />
//   }
// }

// export default function MonitoringPage() {
//   const [selectedFilter, setSelectedFilter] = useState("all")
//   const [settings, setSettings] = useState(notificationSettings)
//   const { toast } = useToast()

//   const updateNotificationSetting = (id: string, enabled: boolean) => {
//     setSettings((prev) => prev.map((setting) => (setting.id === id ? { ...setting, enabled } : setting)))
//     toast({
//       title: enabled ? "Notifications enabled" : "Notifications disabled",
//       description: `${settings.find((s) => s.id === id)?.title} notifications have been ${enabled ? "enabled" : "disabled"}.`,
//     })
//   }

//   const sendReminder = (supplierId: string, documentType: string) => {
//     toast({
//       title: "Reminder sent",
//       description: `Reminder sent to supplier about missing ${documentType}.`,
//     })
//   }

//   const acknowledgeAlert = (alertId: number) => {
//     toast({
//       title: "Alert acknowledged",
//       description: "The alert has been marked as acknowledged.",
//     })
//   }

//   return (
//     <div className="relative pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
//       <div className="container mx-auto px-4 py-8 space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-4xl font-bold font-heading mb-4">
//             Monitoring & <span className="gradient-text">Alerts Center</span>
//           </h1>
//           <p className="text-xl text-muted-foreground">
//             Stay informed with real-time notifications and proactive monitoring
//           </p>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid md:grid-cols-4 gap-6">
//           <Card className="border-0 bg-gradient-to-br from-red-500/5 to-red-600/5">
//             <CardContent className="p-6 text-center">
//               <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-red-600">3</div>
//               <div className="text-sm text-muted-foreground">Critical Alerts</div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5">
//             <CardContent className="p-6 text-center">
//               <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-yellow-600">4</div>
//               <div className="text-sm text-muted-foreground">Upcoming Deadlines</div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5">
//             <CardContent className="p-6 text-center">
//               <FileX className="h-8 w-8 text-orange-600 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-orange-600">3</div>
//               <div className="text-sm text-muted-foreground">Missing Documents</div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
//             <CardContent className="p-6 text-center">
//               <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-blue-600">12</div>
//               <div className="text-sm text-muted-foreground">Active Monitors</div>
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="deadlines" className="w-full">
//           <div className="flex justify-between items-center mb-6">
//             <TabsList className="grid w-full max-w-md grid-cols-4">
//               <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
//               <TabsTrigger value="missing">Missing</TabsTrigger>
//               <TabsTrigger value="alerts">Alerts</TabsTrigger>
//               <TabsTrigger value="settings">Settings</TabsTrigger>
//             </TabsList>

//             <div className="flex items-center space-x-2">
//               <Filter className="h-4 w-4 text-muted-foreground" />
//               <Select value={selectedFilter} onValueChange={setSelectedFilter}>
//                 <SelectTrigger className="w-40">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Categories</SelectItem>
//                   <SelectItem value="environmental">Environmental</SelectItem>
//                   <SelectItem value="social">Social</SelectItem>
//                   <SelectItem value="governance">Governance</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <TabsContent value="deadlines" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Clock className="h-5 w-5 mr-2" />
//                   Upcoming Deadlines
//                 </CardTitle>
//                 <CardDescription>Track approaching submission deadlines and requirements</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {upcomingDeadlines.map((deadline) => (
//                     <div
//                       key={deadline.id}
//                       className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
//                     >
//                       <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2">
//                           <Calendar className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <div className="font-medium">{deadline.title}</div>
//                             <div className="text-sm text-muted-foreground">
//                               Due: {deadline.dueDate} • {deadline.supplier}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <div className="text-right">
//                           <div className="text-sm font-medium">{deadline.daysLeft} days left</div>
//                           <Badge variant="outline" className="text-xs">
//                             {deadline.type}
//                           </Badge>
//                         </div>
//                         <Badge className={getPriorityColor(deadline.priority)}>{deadline.priority}</Badge>
//                         <Button size="sm" variant="outline">
//                           View Details
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="missing" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <FileX className="h-5 w-5 mr-2" />
//                   Missing Documents
//                 </CardTitle>
//                 <CardDescription>Track overdue and missing supplier documentation</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {missingDocuments.map((doc) => (
//                     <div
//                       key={doc.id}
//                       className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
//                     >
//                       <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2">
//                           <FileX className="h-4 w-4 text-red-600" />
//                           <div>
//                             <div className="font-medium">{doc.document}</div>
//                             <div className="text-sm text-muted-foreground">
//                               {doc.supplier} • {doc.category}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <div className="text-right">
//                           <div className="text-sm font-medium text-red-600">{doc.overdueDays} days overdue</div>
//                           <div className="text-xs text-muted-foreground">Last reminder: {doc.lastReminder}</div>
//                         </div>
//                         <Button size="sm" variant="outline" onClick={() => sendReminder(doc.supplier, doc.document)}>
//                           Send Reminder
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="alerts" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <AlertTriangle className="h-5 w-5 mr-2" />
//                   Risk Alerts
//                 </CardTitle>
//                 <CardDescription>Critical alerts and compliance notifications requiring attention</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {riskAlerts.map((alert) => (
//                     <div
//                       key={alert.id}
//                       className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
//                     >
//                       <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2">
//                           <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
//                             {getSeverityIcon(alert.severity)}
//                           </div>
//                           <div>
//                             <div className="font-medium">{alert.alert}</div>
//                             <div className="text-sm text-muted-foreground">
//                               {alert.supplier} • {alert.category} • {alert.detectedDate}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <div className="text-right">
//                           <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
//                           <div className="text-xs text-muted-foreground mt-1">Impact: {alert.impact}</div>
//                         </div>
//                         <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
//                           Acknowledge
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="settings" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Settings className="h-5 w-5 mr-2" />
//                   Notification Settings
//                 </CardTitle>
//                 <CardDescription>Configure your notification preferences and alert frequencies</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {settings.map((setting) => (
//                     <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div className="flex-1">
//                         <div className="font-medium">{setting.title}</div>
//                         <div className="text-sm text-muted-foreground">{setting.description}</div>
//                         <div className="text-xs text-muted-foreground mt-1">Frequency: {setting.frequency}</div>
//                       </div>
//                       <Switch
//                         checked={setting.enabled}
//                         onCheckedChange={(checked) => updateNotificationSetting(setting.id, checked)}
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-6 p-4 bg-muted/50 rounded-lg">
//                   <h4 className="font-medium mb-2">Email Preferences</h4>
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Daily digest</span>
//                       <Switch defaultChecked />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Weekly summary</span>
//                       <Switch defaultChecked />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Instant alerts</span>
//                       <Switch defaultChecked />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }


// New code for MonitoringPage.tsx

"use client"

import { useState, useEffect } from "react"
=======
"use client"

import { useState } from "react"
>>>>>>> supplier
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
<<<<<<< HEAD
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
=======
>>>>>>> supplier
import { useToast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  Clock,
  FileX,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  Settings,
  Filter,
<<<<<<< HEAD
  FileCheck,
  Users,
  ChevronDown,
  ChevronUp,
  Send,
  Bell,
  Lock,
  Key,
  Monitor,
  HelpCircle,
  Loader2,
  Building,
} from "lucide-react"

// Product categories for filtering - these will be fetched from the products collection
const productCategories = [
  "All Categories",
  "Hydraulics & Pumps",
  "Lighting systems", 
  "Oils, lubricants & coolants",
  "Transmissions & gearboxes",
  "Vehicle chassis & body parts",
  "Wiring Harness",
  "batteries",
  "composite & lightweight material",
  "electrical & electronic components",
  "electrical vehicle components",
  "engines",
  "glass and optical materials",
  "paints coatings & surface terminants",
  "plastic and polymer parts",
  "seats & upholstery",
  "steel",
  "tyres"
]

interface Supplier {
  company_name: string
  email_domain: string
  industry: string
  product_id?: string
  product_name?: string  // This will come from the products collection join
  risk_upload_status?: string
  cost_upload_status?: string
  reliability_upload_status?: string
  esg_upload_status?: string
  all_documents_uploaded?: boolean
  missing_documents_count?: number
}
=======
} from "lucide-react"

const upcomingDeadlines = [
  {
    id: 1,
    title: "GreenTech Solutions - Annual ESG Report",
    dueDate: "2024-02-15",
    daysLeft: 12,
    priority: "high",
    supplier: "GreenTech Solutions",
    type: "ESG Report",
  },
  {
    id: 2,
    title: "EcoManufacturing Co - Carbon Footprint Assessment",
    dueDate: "2024-02-20",
    daysLeft: 17,
    priority: "medium",
    supplier: "EcoManufacturing Co",
    type: "Environmental",
  },
  {
    id: 3,
    title: "SustainableParts Inc - Labor Standards Certification",
    dueDate: "2024-02-25",
    daysLeft: 22,
    priority: "medium",
    supplier: "SustainableParts Inc",
    type: "Social",
  },
  {
    id: 4,
    title: "CleanEnergy Corp - Governance Policy Update",
    dueDate: "2024-03-01",
    daysLeft: 26,
    priority: "low",
    supplier: "CleanEnergy Corp",
    type: "Governance",
  },
]

const missingDocuments = [
  {
    id: 1,
    supplier: "BudgetSupply Ltd",
    document: "Environmental Policy Statement",
    category: "Environmental",
    overdueDays: 5,
    lastReminder: "2024-01-25",
  },
  {
    id: 2,
    supplier: "SustainableParts Inc",
    document: "Diversity & Inclusion Report",
    category: "Social",
    overdueDays: 12,
    lastReminder: "2024-01-20",
  },
  {
    id: 3,
    supplier: "TechComponents LLC",
    document: "Board Independence Declaration",
    category: "Governance",
    overdueDays: 3,
    lastReminder: "2024-01-28",
  },
]

const riskAlerts = [
  {
    id: 1,
    supplier: "GlobalManufacturing Inc",
    alert: "Regulatory compliance score dropped below threshold",
    severity: "critical",
    category: "Compliance",
    detectedDate: "2024-01-30",
    impact: "High",
  },
  {
    id: 2,
    supplier: "EcoManufacturing Co",
    alert: "Carbon emissions increased by 15% this quarter",
    severity: "warning",
    category: "Environmental",
    detectedDate: "2024-01-28",
    impact: "Medium",
  },
  {
    id: 3,
    supplier: "SustainableParts Inc",
    alert: "Employee safety incidents reported",
    severity: "warning",
    category: "Social",
    detectedDate: "2024-01-26",
    impact: "Medium",
  },
  {
    id: 4,
    supplier: "TechComponents LLC",
    alert: "Financial transparency concerns identified",
    severity: "medium",
    category: "Governance",
    detectedDate: "2024-01-24",
    impact: "Low",
  },
]
>>>>>>> supplier

const notificationSettings = [
  {
    id: "deadlines",
    title: "Upcoming Deadlines",
    description: "Get notified about approaching submission deadlines",
    enabled: true,
    frequency: "daily",
  },
  {
    id: "missing-docs",
    title: "Missing Documents",
    description: "Alerts for overdue or missing supplier documents",
    enabled: true,
    frequency: "weekly",
  },
  {
    id: "risk-alerts",
    title: "Risk Alerts",
    description: "Critical risk notifications and compliance issues",
    enabled: true,
    frequency: "immediate",
  },
  {
    id: "score-changes",
    title: "Score Changes",
    description: "Notifications when supplier ESG scores change significantly",
    enabled: false,
    frequency: "weekly",
  },
  {
    id: "new-suppliers",
    title: "New Supplier Registrations",
    description: "Alerts when new suppliers register on the platform",
    enabled: true,
    frequency: "daily",
  },
]

<<<<<<< HEAD
function getDocumentStatus(status?: string) {
  return status === "success"
}

interface CompanyDocumentSectionProps {
  supplier: Supplier
  isExpanded: boolean
  onToggle: () => void
}

const CompanyDocumentSection = ({ supplier, isExpanded, onToggle }: CompanyDocumentSectionProps) => {
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)
  const { toast } = useToast()
  
  const documents = [
    { 
      name: "Risk Assessment", 
      status: getDocumentStatus(supplier.risk_upload_status), 
      type: "risk",
      description: "Operational and financial risk evaluation"
    },
    { 
      name: "Cost Analysis", 
      status: getDocumentStatus(supplier.cost_upload_status), 
      type: "cost",
      description: "Cost efficiency and pricing analysis"
    },
    { 
      name: "Reliability Report", 
      status: getDocumentStatus(supplier.reliability_upload_status), 
      type: "reliability",
      description: "Performance and delivery reliability metrics"
    },
    { 
      name: "ESG Report", 
      status: getDocumentStatus(supplier.esg_upload_status), 
      type: "esg",
      description: "Environmental, Social, and Governance assessment"
    },
  ]
  
  const allUploaded = documents.every(doc => doc.status)
  const missingDocs = documents.filter(doc => !doc.status)

  const sendReminder = async (documentType: string, documentName: string) => {
    setSendingReminder(documentType)
    
    try {
      const response = await fetch('/api/send-document-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplierEmail: supplier.email_domain,
          companyName: supplier.company_name,
          documentType: documentName,
          reminderType: 'both'
        })
      })

      if (response.ok) {
        toast({
          title: "Reminder Sent Successfully",
          description: `${supplier.company_name} has been notified about the missing ${documentName}`,
          duration: 5000,
        })
      } else {
        throw new Error('Failed to send reminder')
      }
    } catch (error) {
      toast({
        title: "Failed to Send Reminder",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setSendingReminder(null)
    }
  }

  const sendAllReminders = async () => {
    for (const doc of missingDocs) {
      await sendReminder(doc.type, doc.name)
    }
  }
  
  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* Company Header - Clickable */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium text-gray-900">{supplier.company_name}</h3>
              <p className="text-sm text-muted-foreground">
                {supplier.industry} • {supplier.email_domain}
              </p>
              {supplier.product_name && (
                <p className="text-xs text-blue-600 mt-1">
                  Product: {supplier.product_name}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Summary */}
            <div className="text-right">
              {allUploaded ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-red-100 text-red-700">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {missingDocs.length} Missing
                </Badge>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Document status
              </p>
            </div>
            
            {/* Expand/Collapse Icon */}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      {/* Document Status Details - Collapsible */}
      {isExpanded && (
        <div className="border-t bg-gray-50">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Document Status</h4>
              {!allUploaded && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={sendAllReminders}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Send All Reminders
                </Button>
              )}
            </div>
            
            <div className="grid gap-3">
              {documents.map((doc, index) => (
                <div key={index} className="space-y-2">
                  <Label>
                    <div className="flex items-center gap-2">
                      {doc.name}
                      {!doc.status && <span className="text-red-500">*</span>}
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Label>
                  
                  <div className={`p-3 rounded-lg border transition-all duration-300 ${
                    doc.status 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {doc.status ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                              <FileCheck className="h-3 w-3 mr-1" />
                              Uploaded
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                              <FileX className="h-3 w-3 mr-1" />
                              Missing
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {doc.description}
                        </p>
                      </div>
                      
                      {!doc.status && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendReminder(doc.type, doc.name)}
                          disabled={sendingReminder === doc.type}
                          className="ml-3 flex-shrink-0 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 focus:ring-2 focus:ring-blue-500/50"
                        >
                          {sendingReminder === doc.type ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3 mr-1" />
                              Send Reminder
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!allUploaded && (
              <div className="pt-3 border-t bg-white -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Last contact: {new Date().toLocaleDateString()}
                  </span>
                  <span className="text-red-600 font-medium">
                    {missingDocs.length} document{missingDocs.length > 1 ? 's' : ''} pending
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MonitoringPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [settings, setSettings] = useState(notificationSettings)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch suppliers from database with product information
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/suppliers-with-products')
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers')
        }
        const data = await response.json()
        setSuppliers(data.suppliers || [])
        setFilteredSuppliers(data.suppliers || [])
      } catch (error) {
        console.error('Error fetching suppliers:', error)
        toast({
          title: "Error Loading Data",
          description: "Failed to fetch suppliers data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [toast])

  // Filter suppliers by product category
  useEffect(() => {
    if (selectedCategory === "All Categories") {
      setFilteredSuppliers(suppliers)
    } else {
      const filtered = suppliers.filter(supplier => 
        supplier.product_name?.toLowerCase() === selectedCategory.toLowerCase()
      )
      setFilteredSuppliers(filtered)
    }
  }, [selectedCategory, suppliers])

  // Toggle company expansion
  const toggleCompany = (companyName: string) => {
    setExpandedCompanies(prev => {
      const newSet = new Set(prev)
      if (newSet.has(companyName)) {
        newSet.delete(companyName)
      } else {
        newSet.add(companyName)
      }
      return newSet
    })
  }

  // Calculate statistics
  const totalSuppliers = suppliers.length
  const suppliersWithAllDocs = suppliers.filter(supplier => 
    getDocumentStatus(supplier.risk_upload_status) &&
    getDocumentStatus(supplier.cost_upload_status) &&
    getDocumentStatus(supplier.reliability_upload_status) &&
    getDocumentStatus(supplier.esg_upload_status)
  ).length

  const suppliersWithMissingDocs = totalSuppliers - suppliersWithAllDocs
  const activeMonitors = totalSuppliers

  const updateNotificationSetting = (id: string, enabled: boolean) => {
    setSettings((prev) => prev.map((setting) => (setting.id === id ? { ...setting, enabled } : setting)))
    toast({
      title: enabled ? "Notifications Enabled" : "Notifications Disabled",
=======
function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-100 dark:bg-red-900/20"
    case "medium":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    case "low":
      return "text-green-600 bg-green-100 dark:bg-green-900/20"
    default:
      return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "text-red-600 bg-red-100 dark:bg-red-900/20"
    case "warning":
      return "text-orange-600 bg-orange-100 dark:bg-orange-900/20"
    case "medium":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    default:
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "critical":
      return <XCircle className="h-4 w-4" />
    case "warning":
      return <AlertTriangle className="h-4 w-4" />
    case "medium":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <CheckCircle className="h-4 w-4" />
  }
}

export default function MonitoringPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [settings, setSettings] = useState(notificationSettings)
  const { toast } = useToast()

  const updateNotificationSetting = (id: string, enabled: boolean) => {
    setSettings((prev) => prev.map((setting) => (setting.id === id ? { ...setting, enabled } : setting)))
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
>>>>>>> supplier
      description: `${settings.find((s) => s.id === id)?.title} notifications have been ${enabled ? "enabled" : "disabled"}.`,
    })
  }

<<<<<<< HEAD
=======
  const sendReminder = (supplierId: string, documentType: string) => {
    toast({
      title: "Reminder sent",
      description: `Reminder sent to supplier about missing ${documentType}.`,
    })
  }

  const acknowledgeAlert = (alertId: number) => {
    toast({
      title: "Alert acknowledged",
      description: "The alert has been marked as acknowledged.",
    })
  }

>>>>>>> supplier
  return (
    <div className="relative pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold font-heading mb-4">
            Monitoring & <span className="gradient-text">Alerts Center</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Stay informed with real-time notifications and proactive monitoring
          </p>
        </div>

        {/* Quick Stats */}
<<<<<<< HEAD
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="border-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5">
            <CardContent className="p-6 text-center">
              <FileX className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{suppliersWithMissingDocs}</div>
              <div className="text-sm text-muted-foreground">Suppliers with Missing Documents</div>
=======
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-0 bg-gradient-to-br from-red-500/5 to-red-600/5">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-muted-foreground">Critical Alerts</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">4</div>
              <div className="text-sm text-muted-foreground">Upcoming Deadlines</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5">
            <CardContent className="p-6 text-center">
              <FileX className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-muted-foreground">Missing Documents</div>
>>>>>>> supplier
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
<<<<<<< HEAD
              <div className="text-2xl font-bold text-blue-600">{activeMonitors}</div>
              <div className="text-sm text-muted-foreground">Active Supplier Monitors</div>
=======
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-muted-foreground">Active Monitors</div>
>>>>>>> supplier
            </CardContent>
          </Card>
        </div>

<<<<<<< HEAD
        <Tabs defaultValue="missing" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="missing">Missing Documents</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="missing" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Supplier Document Status
                    </CardTitle>
                    <CardDescription>Click on any company to view detailed document status and send reminders</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Filter by product category" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter Summary */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span>
                      Showing {filteredSuppliers.length} of {totalSuppliers} suppliers
                      {selectedCategory !== "All Categories" && (
                        <span className="text-muted-foreground"> in "{selectedCategory}"</span>
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {filteredSuppliers.filter(s => !getDocumentStatus(s.risk_upload_status) || 
                                                    !getDocumentStatus(s.cost_upload_status) || 
                                                    !getDocumentStatus(s.reliability_upload_status) || 
                                                    !getDocumentStatus(s.esg_upload_status)).length} with missing documents
                    </span>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Loading supplier data...</p>
                    </div>
                  </div>
                ) : filteredSuppliers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Suppliers Found</h3>
                    <p>
                      {selectedCategory === "All Categories" 
                        ? "No suppliers are currently registered in the system." 
                        : `No suppliers found for "${selectedCategory}" products.`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSuppliers.map((supplier, index) => (
                      <CompanyDocumentSection
                        key={index}
                        supplier={supplier}
                        isExpanded={expandedCompanies.has(supplier.company_name)}
                        onToggle={() => toggleCompany(supplier.company_name)}
                      />
                    ))}
                  </div>
                )}
=======
        <Tabs defaultValue="deadlines" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
              <TabsTrigger value="missing">Missing</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="deadlines" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>Track approaching submission deadlines and requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{deadline.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Due: {deadline.dueDate} • {deadline.supplier}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{deadline.daysLeft} days left</div>
                          <Badge variant="outline" className="text-xs">
                            {deadline.type}
                          </Badge>
                        </div>
                        <Badge className={getPriorityColor(deadline.priority)}>{deadline.priority}</Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileX className="h-5 w-5 mr-2" />
                  Missing Documents
                </CardTitle>
                <CardDescription>Track overdue and missing supplier documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {missingDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <FileX className="h-4 w-4 text-red-600" />
                          <div>
                            <div className="font-medium">{doc.document}</div>
                            <div className="text-sm text-muted-foreground">
                              {doc.supplier} • {doc.category}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">{doc.overdueDays} days overdue</div>
                          <div className="text-xs text-muted-foreground">Last reminder: {doc.lastReminder}</div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => sendReminder(doc.supplier, doc.document)}>
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Risk Alerts
                </CardTitle>
                <CardDescription>Critical alerts and compliance notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                            {getSeverityIcon(alert.severity)}
                          </div>
                          <div>
                            <div className="font-medium">{alert.alert}</div>
                            <div className="text-sm text-muted-foreground">
                              {alert.supplier} • {alert.category} • {alert.detectedDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">Impact: {alert.impact}</div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
>>>>>>> supplier
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
<<<<<<< HEAD
                  <Bell className="h-5 w-5 mr-2" />
=======
                  <Settings className="h-5 w-5 mr-2" />
>>>>>>> supplier
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure your notification preferences and alert frequencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{setting.title}</div>
                        <div className="text-sm text-muted-foreground">{setting.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">Frequency: {setting.frequency}</div>
                      </div>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={(checked) => updateNotificationSetting(setting.id, checked)}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Email Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily digest</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly summary</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Instant alerts</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
