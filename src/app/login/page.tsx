import { Suspense } from "react"
import { LoginWidget } from "@/components/widgets/login-widget"

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginWidget />
    </Suspense>
  )
}
