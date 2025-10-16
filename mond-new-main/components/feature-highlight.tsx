"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function FeatureHighlight() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.1)
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation(0.1)

  return (
    <section className="px-8 py-16 md:py-20 bg-[#FFF8F0]">
      <div className="container-custom" style={{ maxWidth: "1080px" }}>
        <div
          ref={titleRef}
          className={`mb-12 transition-all duration-1000 ease-out ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 break-keep-all text-center"
            style={{ lineHeight: "1.25" }}
          >
            <span className="text-[#333333]">챗 GPT와 구글 트렌드 API를 결합해,</span>
            <br />
            <span className="text-[#ff8000]">지금 이순간, 가장 핫한 콘텐츠</span>
            <span className="text-[#333333]">를 만들어드립니다.</span>
          </h2>
        </div>

        <div
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ease-out ${
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start text-left transition-all duration-700 ease-out break-keep-all"
            style={{ transitionDelay: "0ms" }}
          >
            <div className="flex items-center mb-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ico_01-C7BfUt0dBEYJotjyzvZxkG5FGIwxJq.png"
                alt="ChatGPT Icon"
                width="40"
                height="40"
                className="mr-2"
              />
              <h3 className="text-lg sm:text-xl font-bold">ChatGPT</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-moderate">무궁무진한 아이디어와 자동 문안 생성</p>
          </div>

          <div
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start text-left transition-all duration-700 ease-out break-keep-all"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex items-center mb-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ico_02-9G0iiiYQCJG8YAGEIOYQ6vp1t8RC63.png"
                alt="Google Trends API Icon"
                width="40"
                height="40"
                className="mr-2"
              />
              <h3 className="text-lg sm:text-xl font-bold">구글트렌드 API</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-moderate">지금 가장 뜨거운 이슈를 실시간 분석</p>
          </div>

          <div
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start text-left transition-all duration-700 ease-out break-keep-all"
            style={{ transitionDelay: "400ms" }}
          >
            <div className="flex items-center mb-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ico_03-f0H6oqY3iNcskYmc2BL9S2txiDK2it.png"
                alt="Product Service Info Icon"
                width="40"
                height="40"
                className="mr-2"
              />
              <h3 className="text-lg sm:text-xl font-bold">내 상품, 서비스 정보</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-moderate">브랜드 고유 매력을 빠짐없이 반영</p>
          </div>
        </div>
      </div>
    </section>
  )
}
