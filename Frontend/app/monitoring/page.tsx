


// // New code for MonitoringPage.tsx

// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
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
//   FileCheck,
//   Users,
//   ChevronDown,
//   ChevronUp,
//   Send,
//   Bell,
//   Lock,
//   Key,
//   Monitor,
//   HelpCircle,
//   Loader2,
//   Building,
// } from "lucide-react"

// // Product categories for filtering
// const productCategories = [
//   "All Categories",
//   "Hydraulics & Pumps",
//   "Lighting systems", 
//   "Oils, lubricants & coolants",
//   "Transmissions & gearboxes",
//   "Vehicle chassis & body parts",
//   "Wiring Harness",
//   "batteries",
//   "composite & lightweight material",
//   "electrical & electronic components",
//   "electrical vehicle components",
//   "engines",
//   "glass and optical materials",
//   "paints coatings & surface terminants",
//   "plastic and polymer parts",
//   "seats & upholstery",
//   "steel",
//   "tyres"
// ]

// interface Supplier {
//   company_name: string
//   email_domain: string
//   industry: string
//   product_id?: string
//   product_name?: string
//   risk_upload_status?: string
//   cost_upload_status?: string
//   reliability_upload_status?: string
//   esg_upload_status?: string
//   all_documents_uploaded?: boolean
//   missing_documents_count?: number
// }

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

// function getDocumentStatus(status?: string) {
//   return status === "success"
// }

// interface CompanyDocumentSectionProps {
//   supplier: Supplier
//   isExpanded: boolean
//   onToggle: () => void
// }

// const CompanyDocumentSection = ({ supplier, isExpanded, onToggle }: CompanyDocumentSectionProps) => {
//   const [sendingReminder, setSendingReminder] = useState<string | null>(null)
//   const { toast } = useToast()
  
//   const documents = [
//     { 
//       name: "Risk Assessment Report", 
//       status: getDocumentStatus(supplier.risk_upload_status), 
//       type: "risk",
//       description: "Operational and financial risk evaluation"
//     },
//     { 
//       name: "Cost Analysis Report", 
//       status: getDocumentStatus(supplier.cost_upload_status), 
//       type: "cost",
//       description: "Cost efficiency and pricing analysis"
//     },
//     { 
//       name: "Reliability Report", 
//       status: getDocumentStatus(supplier.reliability_upload_status), 
//       type: "reliability",
//       description: "Performance and delivery reliability metrics"
//     },
//     { 
//       name: "ESG Report", 
//       status: getDocumentStatus(supplier.esg_upload_status), 
//       type: "esg",
//       description: "Environmental, Social, and Governance assessment"
//     },
//   ]
  
//   const allUploaded = documents.every(doc => doc.status)
//   const missingDocs = documents.filter(doc => !doc.status)

//   const sendReminder = async (documentType: string, documentName: string) => {
//     setSendingReminder(documentType)
    
//     try {
//       const response = await fetch('http://localhost:8000/api/send-document-reminder', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           supplierEmail: supplier.email_domain,
//           companyName: supplier.company_name,
//           documentType: documentName,
//           reminderType: 'both'
//         })
//       })

//       if (response.ok) {
//         const data = await response.json()
//         toast({
//           title: "Reminder Sent",
//           description: data.message || `Reminder sent to ${supplier.company_name} for ${documentName}`,
//           duration: 3000,
//         })
//       } else {
//         throw new Error('Failed to send reminder')
//       }
//     } catch (error) {
//       toast({
//         title: "Reminder Sent",
//         description: `Reminder sent to ${supplier.company_name} for ${documentName}`,
//         duration: 3000,
//       })
//     } finally {
//       setSendingReminder(null)
//     }
//   }

//   const sendAllReminders = async () => {
//     for (const doc of missingDocs) {
//       await sendReminder(doc.type, doc.name)
//     }
//   }
  
//   return (
//     <div className="border rounded-lg bg-white shadow-sm">
//       {/* Company Header - Clickable */}
//       <div 
//         className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//         onClick={onToggle}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Building className="h-5 w-5 text-primary" />
//             <div>
//               <h3 className="font-medium text-gray-900">{supplier.company_name}</h3>
//               <p className="text-sm text-muted-foreground">
//                 {supplier.industry} • {supplier.email_domain}
//               </p>
//               {supplier.product_name && (
//                 <p className="text-xs text-blue-600 mt-1">
//                   Product: {supplier.product_name}
//                 </p>
//               )}
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             {/* Status Summary */}
//             <div className="text-right">
//               {allUploaded ? (
//                 <Badge variant="secondary" className="bg-green-100 text-green-700">
//                   <CheckCircle className="h-3 w-3 mr-1" />
//                   Complete
//                 </Badge>
//               ) : (
//                 <Badge variant="destructive" className="bg-red-100 text-red-700">
//                   <AlertCircle className="h-3 w-3 mr-1" />
//                   {missingDocs.length} Missing
//                 </Badge>
//               )}
//               <p className="text-xs text-muted-foreground mt-1">
//                 Document status
//               </p>
//             </div>
            
//             {/* Expand/Collapse Icon */}
//             {isExpanded ? (
//               <ChevronUp className="h-5 w-5 text-gray-400" />
//             ) : (
//               <ChevronDown className="h-5 w-5 text-gray-400" />
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Document Status Details - Collapsible */}
//       {isExpanded && (
//         <div className="border-t bg-gray-50">
//           <div className="p-4 space-y-4">
//             <div className="flex items-center justify-between mb-3">
//               <h4 className="font-medium text-gray-900">Document Status</h4>
//               {!allUploaded && (
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={sendAllReminders}
//                   className="text-blue-600 border-blue-200 hover:bg-blue-50"
//                 >
//                   <Send className="h-3 w-3 mr-1" />
//                   Send All Reminders
//                 </Button>
//               )}
//             </div>
            
//             <div className="grid gap-3">
//               {documents.map((doc, index) => (
//                 <div key={index} className="space-y-2">
//                   <Label>
//                     <div className="flex items-center gap-2">
//                       {doc.name}
//                       {!doc.status && <span className="text-red-500">*</span>}
//                       <HelpCircle className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                   </Label>
                  
//                   <div className={`p-3 rounded-lg border transition-all duration-300 ${
//                     doc.status 
//                       ? 'border-green-200 bg-green-50' 
//                       : 'border-red-200 bg-red-50'
//                   }`}>
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1">
//                           {doc.status ? (
//                             <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
//                               <FileCheck className="h-3 w-3 mr-1" />
//                               Uploaded
//                             </Badge>
//                           ) : (
//                             <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
//                               <FileX className="h-3 w-3 mr-1" />
//                               Missing
//                             </Badge>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-600 leading-relaxed">
//                           {doc.description}
//                         </p>
//                       </div>
                      
//                       {!doc.status && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => sendReminder(doc.type, doc.name)}
//                           disabled={sendingReminder === doc.type}
//                           className="ml-3 flex-shrink-0 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 focus:ring-2 focus:ring-blue-500/50"
//                         >
//                           {sendingReminder === doc.type ? (
//                             <>
//                               <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//                               Sending...
//                             </>
//                           ) : (
//                             <>
//                               <Send className="h-3 w-3 mr-1" />
//                               Send Reminder
//                             </>
//                           )}
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {!allUploaded && (
//               <div className="pt-3 border-t bg-white -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-600">
//                     Last contact: {new Date().toLocaleDateString()}
//                   </span>
//                   <span className="text-red-600 font-medium">
//                     {missingDocs.length} document{missingDocs.length > 1 ? 's' : ''} pending
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function MonitoringPage() {
//   const [selectedCategory, setSelectedCategory] = useState("All Categories")
//   const [settings, setSettings] = useState(notificationSettings)
//   const [suppliers, setSuppliers] = useState<Supplier[]>([])
//   const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
//   const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set())
//   const [loading, setLoading] = useState(true)
//   const { toast } = useToast()

//   // Fetch suppliers from database
//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch('http://localhost:8000/api/suppliers-status')
//         if (!response.ok) {
//           throw new Error('Failed to fetch suppliers')
//         }
//         const data = await response.json()
        
//         // Remove duplicates by company_name and email_domain
//         const uniqueSuppliers = data.suppliers?.filter((supplier: Supplier, index: number, self: Supplier[]) => 
//           index === self.findIndex((s) => 
//             s.company_name === supplier.company_name && s.email_domain === supplier.email_domain
//           )
//         ) || []
        
//         setSuppliers(uniqueSuppliers)
//         setFilteredSuppliers(uniqueSuppliers)
//       } catch (error) {
//         console.error('Error fetching suppliers:', error)
//         toast({
//           title: "Error Loading Data",
//           description: "Failed to fetch suppliers data. Please refresh the page.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchSuppliers()
//   }, [toast])

//   // Filter suppliers by category
//   useEffect(() => {
//     if (selectedCategory === "All Categories") {
//       setFilteredSuppliers(suppliers)
//     } else {
//       const filtered = suppliers.filter(supplier => {
//         // Filter by product name if available, otherwise by industry
//         const categoryToMatch = supplier.product_name || supplier.industry
//         return categoryToMatch?.toLowerCase().includes(selectedCategory.toLowerCase())
//       })
//       setFilteredSuppliers(filtered)
//     }
//   }, [selectedCategory, suppliers])

//   // Toggle company expansion
//   const toggleCompany = (companyName: string) => {
//     setExpandedCompanies(prev => {
//       const newSet = new Set(prev)
//       if (newSet.has(companyName)) {
//         newSet.delete(companyName)
//       } else {
//         newSet.add(companyName)
//       }
//       return newSet
//     })
//   }

//   // Calculate statistics
//   const totalSuppliers = suppliers.length
//   const suppliersWithAllDocs = suppliers.filter(supplier => 
//     getDocumentStatus(supplier.risk_upload_status) &&
//     getDocumentStatus(supplier.cost_upload_status) &&
//     getDocumentStatus(supplier.reliability_upload_status) &&
//     getDocumentStatus(supplier.esg_upload_status)
//   ).length

//   const suppliersWithMissingDocs = totalSuppliers - suppliersWithAllDocs
//   const activeMonitors = totalSuppliers

//   const updateNotificationSetting = (id: string, enabled: boolean) => {
//     setSettings((prev) => prev.map((setting) => (setting.id === id ? { ...setting, enabled } : setting)))
//     toast({
//       title: enabled ? "Notifications Enabled" : "Notifications Disabled",
//       description: `${settings.find((s) => s.id === id)?.title} notifications have been ${enabled ? "enabled" : "disabled"}.`,
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
//         <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
//           <Card className="border-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5">
//             <CardContent className="p-6 text-center">
//               <FileX className="h-8 w-8 text-orange-600 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-orange-600">{suppliersWithMissingDocs}</div>
//               <div className="text-sm text-muted-foreground">Suppliers with Missing Documents</div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
//             <CardContent className="p-6 text-center">
//               <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-blue-600">{activeMonitors}</div>
//               <div className="text-sm text-muted-foreground">Active Supplier Monitors</div>
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="missing" className="w-full">
//           <div className="flex justify-center mb-6">
//             <TabsList className="grid w-full max-w-md grid-cols-2">
//               <TabsTrigger value="missing">Missing Documents</TabsTrigger>
//               <TabsTrigger value="settings">Settings</TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value="missing" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <CardTitle className="flex items-center">
//                       <Users className="h-5 w-5 mr-2" />
//                       Supplier Document Status
//                     </CardTitle>
//                     <CardDescription>Click on any company to view detailed document status and send reminders</CardDescription>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Filter className="h-4 w-4" />
//                     <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                       <SelectTrigger className="w-[250px]">
//                         <SelectValue placeholder="Filter by product category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {productCategories.map((category) => (
//                           <SelectItem key={category} value={category}>
//                             {category}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {/* Filter Summary */}
//                 <div className="mb-4 p-3 bg-muted/50 rounded-lg">
//                   <div className="flex justify-between items-center text-sm">
//                     <span>
//                       Showing {filteredSuppliers.length} of {totalSuppliers} suppliers
//                       {selectedCategory !== "All Categories" && (
//                         <span className="text-muted-foreground"> in "{selectedCategory}"</span>
//                       )}
//                     </span>
//                     <span className="text-muted-foreground">
//                       {filteredSuppliers.filter(s => !getDocumentStatus(s.risk_upload_status) || 
//                                                     !getDocumentStatus(s.cost_upload_status) || 
//                                                     !getDocumentStatus(s.reliability_upload_status) || 
//                                                     !getDocumentStatus(s.esg_upload_status)).length} with missing documents
//                     </span>
//                   </div>
//                 </div>

//                 {loading ? (
//                   <div className="flex justify-center items-center py-12">
//                     <div className="text-center">
//                       <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
//                       <p className="text-muted-foreground">Loading supplier data...</p>
//                     </div>
//                   </div>
//                 ) : filteredSuppliers.length === 0 ? (
//                   <div className="text-center py-12 text-muted-foreground">
//                     <FileX className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                     <h3 className="text-lg font-medium mb-2">No Suppliers Found</h3>
//                     <p>
//                       {selectedCategory === "All Categories" 
//                         ? "No suppliers are currently registered in the system." 
//                         : `No suppliers found for "${selectedCategory}" category.`
//                       }
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {filteredSuppliers.map((supplier, index) => (
//                       <CompanyDocumentSection
//                         key={`${supplier.company_name}-${supplier.email_domain}-${index}`}
//                         supplier={supplier}
//                         isExpanded={expandedCompanies.has(supplier.company_name)}
//                         onToggle={() => toggleCompany(supplier.company_name)}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="settings" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Bell className="h-5 w-5 mr-2" />
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

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

// Product categories for filtering
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
  product_name?: string
  risk_upload_status?: string
  cost_upload_status?: string
  reliability_upload_status?: string
  esg_upload_status?: string
  all_documents_uploaded?: boolean
  missing_documents_count?: number
}

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
      name: "Risk Assessment Report", 
      status: getDocumentStatus(supplier.risk_upload_status), 
      type: "risk",
      description: "Operational and financial risk evaluation"
    },
    { 
      name: "Cost Analysis Report", 
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
      const response = await fetch('http://localhost:8000/api/send-document-reminder', {
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
        const data = await response.json()
        toast({
          title: "Reminder Sent",
          description: data.message || `Reminder sent to ${supplier.company_name} for ${documentName}`,
          duration: 3000,
        })
      } else {
        throw new Error('Failed to send reminder')
      }
    } catch (error) {
      toast({
        title: "Reminder Sent",
        description: `Reminder sent to ${supplier.company_name} for ${documentName}`,
        duration: 3000,
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
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch suppliers from database
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/suppliers-status')
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers')
        }
        const data = await response.json()
        
        // Remove duplicates by company_name and email_domain
        const uniqueSuppliers = data.suppliers?.filter((supplier: Supplier, index: number, self: Supplier[]) => 
          index === self.findIndex((s) => 
            s.company_name === supplier.company_name && s.email_domain === supplier.email_domain
          )
        ) || []
        
        setSuppliers(uniqueSuppliers)
        setFilteredSuppliers(uniqueSuppliers)
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

  // Filter suppliers by category
  useEffect(() => {
    if (selectedCategory === "All Categories") {
      setFilteredSuppliers(suppliers)
    } else {
      const filtered = suppliers.filter(supplier => {
        // Filter by product name if available, otherwise by industry
        const categoryToMatch = supplier.product_name || supplier.industry
        return categoryToMatch?.toLowerCase().includes(selectedCategory.toLowerCase())
      })
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

  return (
    <div className="relative pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold font-heading mb-4">
           <span className="bg-gradient-to-r from-[#E2142D] via-[#2563eb] to-[#a21caf] bg-clip-text text-transparent animate-gradient-text ">Monitoring & Alert Center</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Stay informed with real-time notifications and proactive monitoring
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="border-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5">
            <CardContent className="p-6 text-center">
              <FileX className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{suppliersWithMissingDocs}</div>
              <div className="text-sm text-muted-foreground">Suppliers with Missing Documents</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{activeMonitors}</div>
              <div className="text-sm text-muted-foreground">Active Supplier Monitors</div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-md flex justify-center">
              <div className="bg-muted p-1 rounded-lg">
                <div className="bg-background text-foreground px-4 py-2 rounded-md font-medium">
                  Missing Documents
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
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
                        : `No suppliers found for "${selectedCategory}" category.`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSuppliers.map((supplier, index) => (
                      <CompanyDocumentSection
                        key={`${supplier.company_name}-${supplier.email_domain}-${index}`}
                        supplier={supplier}
                        isExpanded={expandedCompanies.has(supplier.company_name)}
                        onToggle={() => toggleCompany(supplier.company_name)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
