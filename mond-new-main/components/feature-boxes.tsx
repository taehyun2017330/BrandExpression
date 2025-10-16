"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type FeatureBoxProps = {
  imageUrl: string
  titleColor: string
  title: string
  subtitle: string
  description: string
  delay?: number
}

function FeatureBox({ imageUrl, titleColor, title, subtitle, description, delay = 0 }: FeatureBoxProps) {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <div
      ref={ref}
      className={`bg-[#f9f9f9] rounded-xl overflow-hidden mb-12 shadow-sm transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5 bg-[#f2f2f2] p-0 flex items-center justify-center">
          <div className="relative w-full h-64 md:h-72">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
        <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center break-keep-all">
          <h4 className={`text-[${titleColor}] text-base sm:text-lg font-medium mb-1`}>{title}</h4>
          <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-moderate">{subtitle}</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-moderate">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function FeatureBoxes() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.1)

  const features = [
    {
      imageUrl: "/images/feature-1.png",
      titleColor: "#ff8000",
      title: "더 풍부한 아이디어",
      subtitle: "5만 건 이상의 트렌드 분석",
      description:
        "벚꽃, 명절연휴, 유행 등 실시간 업데이트되는 시장 흐름을 놓치지 않고, 핵심 키워드와 방향성을 빠르게 파악하여 콘텐츠에 적용할 수 있어요.",
    },
    {
      imageUrl: "/images/feature-2.png",
      titleColor: "#ff8000",
      title: "고민할 필요 없는",
      subtitle: "캡션, 본문 텍스트 자동 생성",
      description: "SNS, 뉴스레터, 블로그 등 어디에나 바로 쓸 문장을 몇 초 만에 완성해보세요.",
    },
    {
      imageUrl: "/images/feature-3.png",
      titleColor: "#ff8000",
      title: "시간과 비용을 아끼는",
      subtitle: "간편 협업 & 일정 관리",
      description: "하나의 워크스페이스에서 팀원들과 의견을 나누고, 마감 일정도 간단히 공유할 수 있어요.",
    },
  ]

  return (
    <section className="px-8 py-16 md:py-20 bg-white">
      <div
        ref={sectionRef}
        className={`container-custom transition-all duration-1000 ease-out ${
          sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ maxWidth: "1080px" }}
      >
        {/* 상단 텍스트 */}
        <div className="text-center mb-12">
          <h3 className="text-[#ff8000] text-lg sm:text-xl font-medium mb-2 break-keep-all leading-moderate text-center">
            완벽한 SNS 콘텐츠 툴
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333333] mb-16 break-keep-all leading-moderate text-center">
            콘텐츠 기획에 필요한 모든 기능
          </h2>
        </div>

        {/* 피처 박스들 */}
        {features.map((feature, index) => (
          <FeatureBox
            key={index}
            imageUrl={feature.imageUrl}
            titleColor={feature.titleColor}
            title={feature.title}
            subtitle={feature.subtitle}
            description={feature.description}
            delay={index * 200} // Stagger the animations
          />
        ))}
      </div>
    </section>
  )
}
