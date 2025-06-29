import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20">{children}</main>
      <Footer />
    </div>
  )
} 