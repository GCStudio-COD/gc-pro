"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plane } from "lucide-react"
import { useAuthStore } from "@/store/use-auth-store"
import { fetchApi } from "@/lib/api"
import { useRoleStore } from "@/store/use-role-store"

export function EmployeeLeaveBalanceWidget() {
  const { userId } = useAuthStore()
  const { role } = useRoleStore()
  const [balances, setBalances] = useState<any>(null)

  useEffect(() => {
    if (userId) {
      fetchApi(`/leaves/balances/${userId}`, {}, role)
        .then(async (res) => {
          if (!res.ok) {
            setBalances({ paid: { used: 0, total: 1 } })
            return
          }
          const data = await res.json()
          if (data && typeof data === "object" && data.paid) {
            setBalances(data)
          } else {
            setBalances({ paid: { used: 0, total: 1 } })
          }
        })
        .catch((err) => {
          console.error(err)
          setBalances({ paid: { used: 0, total: 1 } })
        })
    } else {
      setBalances({ paid: { used: 0, total: 1 } })
    }
  }, [userId, role])

  if (!balances || !balances.paid) return null

  const used = Number(balances.paid.used) || 0
  const total = Number(balances.paid.total) || 1
  const leaves = [
    { type: "Paid Time Off (Monthly 1)", used, total, color: "bg-primary" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="col-span-1"
    >
      <Card className="h-full border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plane className="h-5 w-5" /> Leave Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {leaves.map((leave, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{leave.type}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.max(0, leave.total - leave.used)} days left
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${leave.color}`}
                    style={{
                      width: `${leave.total > 0 ? Math.min(100, Math.max(0, (leave.used / leave.total) * 100)) : 0}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Used {leave.used} of {leave.total}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

