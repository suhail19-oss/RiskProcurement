"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  FileCheck,
  FileX,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Shield,
  DollarSign,
  Activity,
  ChevronDown,
  ChevronUp
} from "lucide-react"

interface DocumentStatus {
  esg_status?: string
  risk_status?: string
  cost_status?: string
  reliability_status?: string
}

interface DocumentStatusCollapsibleProps {
  documentStatus: DocumentStatus
  userRole: string
}

const DocumentStatusCollapsible = ({ documentStatus, userRole }: DocumentStatusCollapsibleProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const documents = [
    {
      name: "ESG Report",
      status: documentStatus.esg_status === "success",
      icon: FileText,
      route: "/data-submission",
      description: "Environmental, Social, and Governance assessment"
    },
    {
      name: "Risk Assessment",
      status: documentStatus.risk_status === "success",
      icon: Shield,
      route: "/data-submission",
      description: "Operational and financial risk evaluation"
    },
    {
      name: "Cost Analysis",
      status: documentStatus.cost_status === "success",
      icon: DollarSign,
      route: "/data-submission",
      description: "Cost efficiency and pricing analysis"
    },
    {
      name: "Reliability Report",
      status: documentStatus.reliability_status === "success",
      icon: Activity,
      route: "/data-submission",
      description: "Performance and delivery reliability metrics"
    }
  ]

  const uploadedCount = documents.filter(doc => doc.status).length
  const totalCount = documents.length
  const allUploaded = uploadedCount === totalCount

  const handleUploadClick = (route: string) => {
    router.push(route)
  }

  // Only show for suppliers
  if (userRole.toLowerCase() !== "supplier") {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Document Upload Status
            </CardTitle>
            <CardDescription>
              Track your document submission progress
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              {allUploaded ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-red-100 text-red-700">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {totalCount - uploadedCount} Pending
                </Badge>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {uploadedCount} of {totalCount} uploaded
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc, index) => {
              const IconComponent = doc.icon
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    doc.status 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      doc.status ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        doc.status ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-xs text-gray-600">{doc.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {doc.status ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <FileCheck className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    ) : (
                      <>
                        <Badge variant="destructive" className="bg-red-100 text-red-700">
                          <FileX className="h-3 w-3 mr-1" />
                          Missing
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleUploadClick(doc.route)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          {!allUploaded && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Complete Your Profile</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Upload all required documents to complete your supplier assessment and improve your visibility to potential partners.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default DocumentStatusCollapsible
