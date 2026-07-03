import { HomeHeroWidget } from "@/widgets/home-hero-widget"
import { HomeOverviewWidget } from "@/widgets/home-overview-widget"
import { HomeDashboardPreviewWidget } from "@/widgets/home-dashboard-preview-widget"
import { HomeWorkflowWidget } from "@/widgets/home-workflow-widget"
import { HomeModulesWidget } from "@/widgets/home-modules-widget"
import { HomeFeaturesWidget } from "@/widgets/home-features-widget"
import { HomeCTAWidget } from "@/widgets/home-cta-widget"
import { HomeFooterWidget } from "@/widgets/home-footer-widget"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Floating Theme Toggle just for marketing page */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="flex-1">
        <HomeHeroWidget />
        <HomeOverviewWidget />
        <HomeDashboardPreviewWidget />
        <HomeWorkflowWidget />
        <HomeModulesWidget />
        <HomeFeaturesWidget />
        <HomeCTAWidget />
      </main>
      
      <HomeFooterWidget />
    </div>
  )
}
