"use client"

import { useEffect, useState } from "react"

export function AnimatedBubble() {
  const [position, setPosition] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        // 위아래로 움직이는 범위 (픽셀)
        const maxOffset = 8

        // 현재 위치가 최대치에 도달하면 방향 전환
        if (prev >= maxOffset) {
          setDirection(-1)
        } else if (prev <= -maxOffset) {
          setDirection(1)
        }

        // 현재 위치에 방향을 곱해 새 위치 계산 (부드러운 움직임을 위해 작은 값 사용)
        return prev + direction * 0.4
      })
    }, 50)

    return () => clearInterval(interval)
  }, [direction])

  return (
    <div
      className="relative inline-block"
      style={{
        transform: `translateY(${position}px)`,
        transition: "transform 0.1s ease-in-out",
      }}
    >
      <div className="bg-[#fff4e7] text-[#f59931] px-5 py-3 rounded-2xl inline-block relative break-keep-all leading-moderate shadow-md text-center">
        {/* 말풍선 꼬리 부분 - 가운데로 변경 */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#fff4e7] rotate-45"></div>
        3분이면, 내 브랜드 맞춤 콘텐츠가 완성돼요
      </div>
    </div>
  )
}
