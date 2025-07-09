
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"
// import { User, Mail, Building, Shield, Loader2, Edit, Save, X } from "lucide-react"
// import DocumentStatusCollapsible from "@/components/DocumentStatusCard"

// interface ProfileData {
//   email: string
//   role: string
//   company_name: string
//   email_domain: string
//   document_status?: {
//     esg_status?: string
//     risk_status?: string
//     cost_status?: string
//     reliability_status?: string
//   }
// }

// export default function ProfilePage() {
//   const [profileData, setProfileData] = useState<ProfileData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [updating, setUpdating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [editData, setEditData] = useState({
//     role: ""
//   })
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("No authentication token found")
//       }

//       const response = await fetch("http://localhost:8000/profile/me", {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       })

//       if (!response.ok) {
//         throw new Error("Failed to fetch profile")
//       }

//       const data = await response.json()
//       setProfileData(data.data)
//       setEditData({
//         role: data.data.role || ""
//       })
//     } catch (error) {
//       console.error("Error fetching profile:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load profile data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEditToggle = () => {
//     if (isEditing) {
//       // Reset edit data if canceling
//       setEditData({
//         role: profileData?.role || ""
//       })
//     }
//     setIsEditing(!isEditing)
//   }

//   const handleSaveProfile = async () => {
//     try {
//       setUpdating(true)
//       const token = localStorage.getItem("token")
      
//       const response = await fetch("http://localhost:8000/profile/update", {
//         method: "PATCH",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(editData)
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update profile")
//       }

//       const result = await response.json()
      
//       // Update local state
//       if (profileData) {
//         setProfileData({
//           ...profileData,
//           ...editData
//         })
//       }
      
//       setIsEditing(false)
//       toast({
//         title: "Success",
//         description: result.message || "Profile updated successfully",
//       })
//     } catch (error) {
//       console.error("Error updating profile:", error)
//       toast({
//         title: "Error",
//         description: "Failed to update profile",
//         variant: "destructive",
//       })
//     } finally {
//       setUpdating(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center min-h-[400px]">
//           <div className="text-center">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//             <p className="text-muted-foreground">Loading profile...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

  

//   if (!profileData) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
//           <p className="text-muted-foreground mt-2">Unable to load your profile data.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 space-y-8">
//       {/* Header */}
//       <div className="text-center">
//         <h1 className="text-3xl font-bold">Your Profile</h1>
//         <p className="text-muted-foreground mt-2">
//           Manage your account information and document status
//         </p>
//       </div>

//       {/* Account Information - Full Width */}
//       <Card className="w-full">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Account Information
//               </CardTitle>
//               <CardDescription>
//                 Your account details and company information
//               </CardDescription>
//             </div>
//             <div className="flex items-center gap-2">
//               {isEditing ? (
//                 <>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={handleEditToggle}
//                     disabled={updating}
//                     className="border-gray-300 text-gray-600 hover:bg-gray-50"
//                   >
//                     <X className="h-4 w-4 mr-1" />
//                     Cancel
//                   </Button>
//                   <Button
//                     size="sm"
//                     onClick={handleSaveProfile}
//                     disabled={updating}
//                     className="bg-green-600 hover:bg-green-700 text-white"
//                   >
//                     {updating ? (
//                       <Loader2 className="h-4 w-4 mr-1 animate-spin" />
//                     ) : (
//                       <Save className="h-4 w-4 mr-1" />
//                     )}
//                     Save
//                   </Button>
//                 </>
//               ) : (
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={handleEditToggle}
//                   className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
//                 >
//                   <Edit className="h-4 w-4 mr-1" />
//                   Edit Profile
//                 </Button>
//               )}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-6 md:grid-cols-2">
//             <div className="space-y-2">
//               <Label className="flex items-center gap-2">
//                 <Mail className="h-4 w-4" />
//                 Email Address
//               </Label>
//               <Input
//                 value={profileData.email}
//                 disabled
//                 className="bg-gray-50"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label className="flex items-center gap-2">
//                 <Building className="h-4 w-4" />
//                 Company Name
//               </Label>
//               <Input
//                 value={profileData.company_name || "Not found"}
//                 disabled
//                 className="bg-gray-50"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label className="flex items-center gap-2">
//                 <Shield className="h-4 w-4" />
//                 Account Role
//               </Label>
//               {isEditing ? (
//                 <Input
//                   value={editData.role}
//                   onChange={(e) => setEditData({ ...editData, role: e.target.value })}
//                   placeholder="Enter your role"
//                   className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
//                 />
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <Badge variant={profileData.role === "supplier" ? "default" : "secondary"}>
//                     {profileData.role === "supplier" ? "Supplier Account" : "Company Account"}
//                   </Badge>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label>Email Domain</Label>
//               <Input
//                 value={profileData.email_domain || profileData.email.split('@')[1]}
//                 disabled
//                 className="bg-gray-50"
//               />
//             </div>
//           </div>

//           {/* Company Dashboard for non-suppliers */}
//           {profileData.role.toLowerCase() !== "supplier" && (
//             <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
//               <div className="text-center">
//                 <Building className="h-12 w-12 mx-auto mb-4 text-blue-600" />
//                 <h3 className="text-lg font-medium mb-2 text-blue-900">Company Account</h3>
//                 <p className="text-blue-700 mb-4">
//                   Access supplier monitoring and management tools
//                 </p>
//                 <Button 
//                   onClick={() => window.location.href = "/monitoring"}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   Go to Monitoring Dashboard
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Document Status Collapsible - Only for Suppliers */}
//       {profileData.role.toLowerCase() === "supplier" && (
//         <DocumentStatusCollapsible
//           documentStatus={profileData.document_status || {}}
//           userRole={profileData.role}
//         />
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Building, Shield, Loader2, Edit, Save, X } from "lucide-react"
import DocumentStatusCollapsible from "@/components/DocumentStatusCard"
import SupplierNotifications from "@/components/SupplierNotifications"

interface ProfileData {
  email: string
  role: string
  company_name: string
  email_domain: string
  document_status?: {
    esg_status?: string
    risk_status?: string
    cost_status?: string
    reliability_status?: string
  }
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    role: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://localhost:8000/profile/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfileData(data.data)
      setEditData({
        role: data.data.role || ""
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({
        role: profileData?.role || ""
      })
    }
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async () => {
    try {
      setUpdating(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch("http://localhost:8000/profile/update", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editData)
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const result = await response.json()
      
      if (profileData) {
        setProfileData({
          ...profileData,
          ...editData
        })
      }
      
      setIsEditing(false)
      toast({
        title: "Success",
        description: result.message || "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
          <p className="text-muted-foreground mt-2">Unable to load your profile data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information and document status
        </p>
      </div>

      {/* Notifications for Suppliers */}
      {profileData.role.toLowerCase() === "supplier" && (
        <SupplierNotifications userEmail={profileData.email} />
      )}

      {/* Account Information - Full Width */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and company information
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEditToggle}
                    disabled={updating}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={updating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEditToggle}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                value={profileData.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company Name
              </Label>
              <Input
                value={profileData.company_name || "Not found"}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Role
              </Label>
              {isEditing ? (
                <Input
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                  placeholder="Enter your role"
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant={profileData.role === "supplier" ? "default" : "secondary"}>
                    {profileData.role === "supplier" ? "Supplier Account" : "Company Account"}
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email Domain</Label>
              <Input
                value={profileData.email_domain || profileData.email.split('@')[1]}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Company Dashboard for non-suppliers */}
          {profileData.role.toLowerCase() !== "supplier" && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-center">
                <Building className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-medium mb-2 text-blue-900">Company Account</h3>
                <p className="text-blue-700 mb-4">
                  Access supplier monitoring and management tools
                </p>
                <Button 
                  onClick={() => window.location.href = "/monitoring"}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go to Monitoring Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Status Collapsible - Only for Suppliers */}
      {profileData.role.toLowerCase() === "supplier" && (
        <DocumentStatusCollapsible
          documentStatus={profileData.document_status || {}}
          userRole={profileData.role}
        />
      )}
    </div>
  )
}
