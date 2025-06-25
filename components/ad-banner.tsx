import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AdBannerProps {
  imageUrl: string
  link: string
  title: string
  buttonText?: string
  className?: string
}

export default function AdBanner({ imageUrl, link, title, buttonText = "Saiba mais", className }: AdBannerProps) {
  return (
    <div className={cn("w-full my-6", className)}>
      <div className="text-xs text-gray-400 mb-1 text-center tracking-widest">PUBLICIDADE</div>
      <Link href={link} target="_blank" rel="noopener noreferrer">
        {/* Mobile: imagem com overlay do título */}
        <div className="block sm:hidden w-full relative rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={600}
            height={150}
            className="w-full h-28 object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 px-2">
            <span className="text-white text-base font-bold text-center break-words w-full leading-snug drop-shadow">
              {title}
            </span>
          </div>
        </div>
        {/* Desktop/tablet: layout completo */}
        <div className="hidden sm:flex flex-row items-center justify-between bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-4 gap-4 hover:shadow-md transition-all">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center w-auto">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              width={120}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>
          {/* Título */}
          <div className="flex-1 text-center sm:text-left min-w-0 max-w-full sm:max-w-none px-2">
            <span
              className="font-semibold text-gray-800 text-lg block break-words whitespace-pre-line leading-snug"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              {title}
            </span>
          </div>
          {/* Botão */}
          <div className="flex-shrink-0 flex items-center justify-center w-auto mt-0">
            <span className="inline-block bg-red-600 text-white text-xs font-bold rounded px-4 py-2 shadow hover:bg-red-700 transition-colors cursor-pointer text-center">
              {buttonText}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
