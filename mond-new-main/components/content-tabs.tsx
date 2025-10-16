"use client"

import { useState, useEffect } from "react"
import { categories, contentItems, type ContentItem } from "@/data/content-data"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

// 배열을 랜덤하게 섞는 함수
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function ContentTabs() {
  const [activeTab, setActiveTab] = useState("beauty") // 기본값을 "beauty"로 유지
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([])
  const { ref: tabsRef, isVisible: tabsVisible } = useScrollAnimation(0.1)
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation(0.1)

  useEffect(() => {
    if (activeTab === "all") {
      // 전체 콘텐츠를 랜덤하게 섞고 9개만 선택
      const randomItems = shuffleArray(contentItems).slice(0, 9)
      setFilteredItems(randomItems)
    } else {
      const filtered = contentItems.filter((item) => item.category === activeTab).slice(0, 9)
      setFilteredItems(filtered)
    }
  }, [activeTab])

  return (
    <section className="px-8 py-16 md:py-20 bg-white">
      {/* 탭 메뉴 */}
      <div
        ref={tabsRef}
        className={`mb-10 w-full bg-[#f8f8f8] transition-all duration-1000 ease-out ${
          tabsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="overflow-x-auto">
          <div className="flex justify-center min-w-max container-custom">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-center whitespace-nowrap transition-colors break-keep-all ${
                  activeTab === category.id
                    ? "bg-[#ff8000] text-white font-medium"
                    : "bg-[#f8f8f8] text-[#666666] hover:bg-[#ffebda]"
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 콘텐츠 그리드 */}
      <div
        ref={contentRef}
        className={`container-custom transition-all duration-1000 ease-out ${
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-[#FFF8F0] rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-700 ease-out break-keep-all"
              style={{
                transitionDelay: `${index * 100}ms`,
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 truncate">{item.title}</h3>
              <p className="text-sm sm:text-sm text-gray-600 line-clamp-3 leading-moderate">{item.description}</p>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">이 카테고리에는 아직 콘텐츠가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  )
}
