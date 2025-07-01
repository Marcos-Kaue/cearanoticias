import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <meta property="og:title" content="Ceará No Grau" />
        <meta property="og:description" content="Seu portal de notícias do Ceará atualizado" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ceará No Grau" />
        <meta name="twitter:description" content="Seu portal de notícias do Ceará atualizado" />
        <meta name="twitter:image" content="/logo.png" />
      </head>
      <Header />
      <main className="flex-1 pb-20">{children}</main>
      <Footer />
    </div>
  )
} 