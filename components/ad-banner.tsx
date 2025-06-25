import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AdBannerProps {
  imageUrl: string
  link: string
  title: string
  className?: string
}

export default function AdBanner({ imageUrl, link, title, className }: AdBannerProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className="text-xs text-gray-500 mb-1 text-center">PUBLICIDADE</div>
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={728}
            height={150}
            className="w-full h-auto object-cover"
          />
        </div>
      </Link>
    </div>
  )
}
