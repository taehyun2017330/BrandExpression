"use client"

import { useRef } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type ContentCardProps = {
  title: string
  description: string
  imageUrl: string
  delay?: number
  isVisible?: boolean
}

function ContentCard({ title, description, imageUrl, delay = 0, isVisible = false }: ContentCardProps) {
  return (
    <div
      className={`min-w-[280px] max-w-[280px] flex-shrink-0 mr-6 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* 카드 컨테이너 */}
      <div className="rounded-3xl overflow-hidden shadow-sm">
        {/* 이미지 */}
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-auto" />

        {/* 텍스트 영역 - 상단 패딩 줄임 */}
        <div className="px-4 pt-2 pb-4 bg-white">
          <h3 className="text-lg font-bold mb-1 break-keep-all">{title}</h3>
          <p className="text-sm text-gray-600 break-keep-all">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function ContentCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.1)
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation(0.1)

  const contentCards = [
    {
      title: "릴스",
      description: "서비스 본질에 집중한 콘텐츠를 기획하세요.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fun01-W3F95mdsdbBgQDTeudQmsKSRZnOriS.png", // fun01.png
    },
    {
      title: "SNS 이벤트",
      description: "신규 고객 모집/신제품 홍보 이벤트를 기획하세요.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fun02-F2FlC1OuRIpXbCnrEdopPgXCIoWXCV.png", // fun02.png
    },
    {
      title: "체험단 이벤트",
      description: "잠재적 고객을 모집하는 이벤트를 기획하세요.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fun03-UcQT1uzxgSjDtIYeZXnKi2UBoGsiRE.png", // fun03.png
    },
    {
      title: "정보성 콘텐츠",
      description: "고객이 필요로 하는 정보를 제공하세요.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fun04-IEijvLykJiX8ghTZesMD7MIFrpwKGZ.png", // fun04.png
    },
    {
      title: "프로모션 기획",
      description: "신제품 홍보를 효과적으로 할 수 있어요.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fun05-1pNwRTUfFWq5kdDSdfRt3pVUIL27oe.png", // fun05.png
    },
    {
      title: "시즈널 콘텐츠",
      description: "지금 이시각, 고객이 가장 관심 있는 주제로 콘텐츠를 기획하세요.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fun06-iUfTvJLFdbkOCD2N0ysasaMOYZijDS.png", // fun06.png
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom px-8" style={{ maxWidth: "1080px" }}>
        <div
          ref={titleRef}
          className={`text-center mb-10 transition-all duration-1000 ease-out ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-[#ff8000] text-lg sm:text-xl font-medium mb-2 break-keep-all leading-moderate text-center">
            1천 개 이상의 분야별 트렌드 콘텐츠 아이디어
          </h3>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-8 break-keep-all leading-moderate">
            릴스, SNS 이벤트, 체험단, 프로모션 등<br />
            모든 콘텐츠를 한 곳에
          </h2>
        </div>
      </div>

      <div className="relative">
        <div
          ref={cardsRef}
          className="flex overflow-x-auto pb-8 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* 모바일에서 첫 화면이 더 왼쪽으로 이동하도록 패딩 조정 */}
          <div className="pl-8 md:pl-[calc(50%-540px-40px)]"></div> {/* 왼쪽 패딩 수정 */}
          {contentCards.map((card, index) => (
            <ContentCard
              key={index}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              delay={index * 100}
              isVisible={cardsVisible}
            />
          ))}
          <div className="pr-4 md:pr-[calc(50%-540px)]"></div> {/* 오른쪽 패딩 수정 */}
        </div>
      </div>
    </section>
  )
}
