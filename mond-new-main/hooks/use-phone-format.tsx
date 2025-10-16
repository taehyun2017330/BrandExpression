"use client"

import { useState, type ChangeEvent } from "react"

export function usePhoneFormat() {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "") // 숫자만 남김

    if (value.length > 3 && value.length <= 7) {
      value = value.slice(0, 3) + "-" + value.slice(3)
    } else if (value.length > 7) {
      value = value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11)
    }

    setPhoneNumber(value)
    e.target.value = value
  }

  return { phoneNumber, handlePhoneChange }
}
