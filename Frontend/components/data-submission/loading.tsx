import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface LoadingProps { 
    isLoading: boolean
    uploadProgress: number
}

export default function Loading({ isLoading, uploadProgress }: LoadingProps) {
    const [showCompletion, setShowCompletion] = useState(false)
    const isComplete = uploadProgress >= 100
    
    useEffect(() => {
        let timer: NodeJS.Timeout
        
        if (isComplete) {
            setShowCompletion(true)
            timer = setTimeout(() => {
                setShowCompletion(false)
            }, 3000) // Show checkmark for 2 seconds
        }
        
        return () => clearTimeout(timer)
    }, [isComplete])

    // Don't render if not loading AND not showing completion state
    if (!isLoading && !showCompletion ) return null

    return ( 
        <div>
            <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="text-center">
                    {/* Conditional rendering: spinner or checkmark */}
                    {!isComplete ? (
                        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4 animate-spin" />
                    ) : (
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 animate-pulse" />
                    )}

                    {/* Dynamic title */}
                    <p className="text-lg font-medium">
                        {!isComplete 
                            ? "Processing your document..." 
                            : "Data extracted successfully!"
                        }
                    </p>

                    {/* Progress text */}
                    <p className="text-muted-foreground" aria-live="polite">
                        {!isComplete 
                            ? (uploadProgress < 50 
                                ? `Extracting data (${uploadProgress}%)` 
                                : `Calculating scores (${uploadProgress}%)`
                            )
                            : "Scores have been calculated"
                        }
                    </p>

                    {/* Progress bar (hidden when complete) */}
                    {!isComplete ? (
                        <Progress 
                            value={uploadProgress} 
                            className="mt-4 w-64 mx-auto h-2" 
                        />
                    ) : (
                        <div className="mt-4 h-2 w-64 mx-auto" />
                    )}
                </div>
            </div>
        </div>
    )
}