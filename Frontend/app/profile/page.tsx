<<<<<<< HEAD

=======
>>>>>>> supplier
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Building, Shield, Loader2, Edit, Save, X } from "lucide-react"
import DocumentStatusCollapsible from "@/components/DocumentStatusCard"
=======
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User, Mail, Shield, Edit, Save, X, Building, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
>>>>>>> supplier

interface ProfileData {
  email: string
  role: string
<<<<<<< HEAD
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
=======
  company_name?: string
  email_domain?: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentProfile, setCurrentProfile] = useState<ProfileData>({ email: "", role: "" })
  const [formData, setFormData] = useState<ProfileData>({ email: "", role: "" })
  const router = useRouter()
  const { userData, isAuthenticated } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated || !userData) {
        router.push("/login")
        return
      }
      
      // Set initial data from userData
      const profileData = {
        email: userData.email,
        role: userData.role
      }
      
      setCurrentProfile(profileData)
      setFormData(profileData)
      
      // Fetch complete profile with company info
      fetchProfile()
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, userData, router])
>>>>>>> supplier

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
<<<<<<< HEAD
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://localhost:8000/profile/me", {
=======
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me`, {
>>>>>>> supplier
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

<<<<<<< HEAD
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
=======
      if (response.ok) {
        const data = await response.json()
        setCurrentProfile(data.data)
        setFormData({
          email: data.data.email,
          role: data.data.role
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
>>>>>>> supplier
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
  const handleEditToggle = () => {
    if (isEditing) {
      // Reset edit data if canceling
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
=======
  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/update`, {
>>>>>>> supplier
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
<<<<<<< HEAD
        body: JSON.stringify(editData)
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const result = await response.json()
      
      // Update local state
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
=======
        body: JSON.stringify(formData)
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.detail || `HTTP ${response.status}: Failed to update profile`)
      }

      // Update localStorage with new data
      const updatedUserData = { ...userData, ...formData }
      localStorage.setItem("userData", JSON.stringify(updatedUserData))

      // Update current profile state
      setCurrentProfile(prev => ({ ...prev, ...formData }))
      
      toast.success("Profile updated successfully!")
      setEditing(false)
      
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      email: currentProfile.email,
      role: currentProfile.role
    })
    setEditing(false)
  }

  const getInitials = (email: string) => {
    if (!email) return "U"
    return email.split("@")[0].substring(0, 2).toUpperCase()
  }

  if (!userData || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading Profile...</h1>
>>>>>>> supplier
          </div>
        </div>
      </div>
    )
  }

<<<<<<< HEAD
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
=======
  const displayData = editing ? formData : currentProfile

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">Your account information</p>
              </div>
              {!editing ? (
                <Button onClick={() => setEditing(true)} className="gap-2 w-fit">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving} 
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
>>>>>>> supplier
                </div>
              )}
            </div>

<<<<<<< HEAD
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
=======
            {/* Profile Overview Card */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  <Avatar className="h-24 w-24 mx-auto sm:mx-0">
                    <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                      {getInitials(displayData.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">
                        {displayData.email.split('@')[0]}
                      </CardTitle>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {displayData.email}
                        </span>
                      </div>
                      {currentProfile.company_name && (
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {currentProfile.company_name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center sm:justify-start">
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="h-3 w-3" />
                        {displayData.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Editable Profile Information Card */}
            {editing && (
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Edit Profile Information
                  </CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Role */}
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        placeholder="Enter your role"
                        className="max-w-md"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Information Card */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Your account details and company information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
                    <div className="space-y-1">
                      <p className="font-medium">Email Address</p>
                      <p className="text-sm text-muted-foreground">
                        {displayData.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="gap-1 w-fit">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
                    <div className="space-y-1">
                      <p className="font-medium">Company Name</p>
                      <p className="text-sm text-muted-foreground">
                        {currentProfile.company_name || "Not found"}
                      </p>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {currentProfile.company_name ? "Found" : "Not Found"}
                    </Badge>
                  </div>

                  <Separator />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
                    <div className="space-y-1">
                      <p className="font-medium">Account Role</p>
                      <p className="text-sm text-muted-foreground">
                        {displayData.role === "supplier" ? "Supplier Account" : "Company Account"}
                      </p>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {displayData.role}
                    </Badge>
                  </div>

                  <Separator />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
                    <div className="space-y-1">
                      <p className="font-medium">Email Domain</p>
                      <p className="text-sm text-muted-foreground">
                        {currentProfile.email_domain || displayData.email.split('@')[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
>>>>>>> supplier
    </div>
  )
}
