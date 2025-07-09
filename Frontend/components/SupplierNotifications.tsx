"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, FileX, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  _id: string
  supplier_email: string
  company_name: string
  message: string
  document_type: string
  type: string
  created_at: string
  read: boolean
  priority: string
}

interface SupplierNotificationsProps {
  userEmail: string
}

export default function SupplierNotifications({ userEmail }: SupplierNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [userEmail])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      
      const response = await fetch('http://localhost:8000/api/supplier-notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'email': userEmail
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token")
      
      const response = await fetch('http://localhost:8000/api/mark-notification-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, read: true }
              : notif
          )
        )
        toast({
          title: "Notification marked as read",
          description: "The reminder has been acknowledged",
        })
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read)
    for (const notification of unreadNotifications) {
      await markAsRead(notification._id)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading notifications...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
               Reminders
              {notifications.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {notifications.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Notifications from companies requesting document uploads
            </CardDescription>
          </div>
          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
            <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
            <p>No pending document reminders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 border rounded-lg transition-all ${
                  notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileX className="h-4 w-4 text-red-500" />
                      <span className="font-medium">{notification.document_type}</span>
                      {notification.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          High Priority
                        </Badge>
                      )}
                      {!notification.read && (
                        <Badge variant="default" className="text-xs bg-blue-600">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {/* <span>From: {notification.company_name}</span> */}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(notification._id)}
                      className="ml-4"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
