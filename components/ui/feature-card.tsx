import * as React from "react"
import { Card, CardContent } from "./card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description: string
  iconClassName?: string
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon: Icon, title, description, iconClassName, className, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("border-2", className)} {...props}>
        <CardContent className="p-6">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10",
            iconClassName
          )}>
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    )
  }
)
FeatureCard.displayName = "FeatureCard"

export { FeatureCard }
