"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useEffect, useState } from "react"

export function AlternatingFeatures() {
  const { ref: title1Ref, isVisible: title1Visible } = useScrollAnimation(0.1)
  const { ref: content1Ref, isVisible: content1Visible } = useScrollAnimation(0.1)
  const { ref: title2Ref, isVisible: title2Visible } = useScrollAnimation(0.1)
  const { ref: content2Ref, isVisible: content2Visible } = useScrollAnimation(0.1)

  // 비디오 로딩 상태 관리
  const [video1Loaded, setVideo1Loaded] = useState(false)
  const [video2Loaded, setVideo2Loaded] = useState(false)

  // Cloudinary 비디오 URL 사용
  const video1Url = "https://res.cloudinary.com/detpylhyc/video/upload/v1744198868/ftqkodujvmwsbt79cpkm.mp4"
  const video2Url = "https://res.cloudinary.com/detpylhyc/video/upload/v1744198868/bbi8uz1wzl7nhvkqnxnw.mp4"

  // 비디오 로딩 확인
  useEffect(() => {
    // Cloudinary 비디오는 항상 사용 가능하다고 가정합니다
    setVideo1Loaded(true)
    setVideo2Loaded(true)
  }, [])

  return (
    <section className="px-8 py-16 md:py-20">
      <div className="container-custom" style={{ maxWidth: "1080px" }}>
        {/* First Feature - AI Content Creation */}
        <div style={{ marginBottom: "160px" }}>
          <h2
            ref={title1Ref}
            className={`text-2xl sm:text-3xl font-bold text-center mb-12 transition-all duration-1000 ease-out break-keep-all leading-moderate ${
              title1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            터지는 콘텐츠를 만드는 AI
          </h2>

          <div
            ref={content1Ref}
            className={`transition-all duration-1000 ease-out ${
              content1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 flex items-center justify-center">
                <div
                  className="w-full flex items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    width: "calc(100% - 2px)",
                    marginRight: "2px",
                    marginBottom: "2px",
                  }}
                >
                  {video1Loaded ? (
                    <video
                      className="w-full"
                      style={{
                        width: "calc(100% + 2px)",
                        borderRadius: "12px",
                      }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                    >
                      <source src={video1Url} type="video/mp4" />
                      애니메이션을 지원하지 않는 브라우저입니다.
                    </video>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">콘텐츠 생성 애니메이션</div>
                  )}
                </div>
              </div>

              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center break-keep-all">
                <h4 className="text-[#ff8000] text-base sm:text-lg font-medium mb-2">정보 입력 한 번으로</h4>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-moderate">다양한 SNS 콘텐츠 생성</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-moderate">
                  최초 가입시 작성한 서비스/상품/개인 정보로
                  <br />
                  트렌드 콘텐츠부터 팔로워 이벤트까지,
                  <br />
                  다양한 콘텐츠를 생성해보세요.
                  <br />
                  고객이 좋아하는 콘텐츠를 아몬드에서 구성하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Feature - SNS Operation */}
        <div>
          <h2
            ref={title2Ref}
            className={`text-2xl sm:text-3xl font-bold text-center mb-12 transition-all duration-1000 ease-out break-keep-all leading-moderate ${
              title2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            터지는 SNS 운영하기
          </h2>

          <div
            ref={content2Ref}
            className={`transition-all duration-1000 ease-out ${
              content2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col md:flex-row-reverse">
              <div className="md:w-1/2 flex items-center justify-center">
                <div className="w-full flex items-center justify-center overflow-hidden">
                  {video2Loaded ? (
                    <video
                      className="w-full rounded-xl"
                      style={{ borderRadius: "12px" }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                    >
                      <source src={video2Url} type="video/mp4" />
                      애니메이션을 지원하지 않는 브라우저입니다.
                    </video>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">SNS 운영 애니메이션</div>
                  )}
                </div>
              </div>

              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center break-keep-all">
                <h4 className="text-[#ff8000] text-base sm:text-lg font-medium mb-2">내 팔로워가 '오늘' 호응할</h4>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-moderate">트렌드 콘텐츠 만들기</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-moderate">
                  지금 이시각, 나의 팔로워가 가장 반응할 트렌드 콘텐츠만 쏙쏙 선별해서 제작할 수 있어요.
                </p>
                <p className="text-gray-600 leading-moderate">
                  뷰티, 생활, 지식, 식품 등 어떤 분야이던 내 계정이 참고할 수 있는 인스타 계정을 알려드려요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
