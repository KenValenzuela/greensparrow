// src/hooks/useTypewriter.ts / .js
import { useEffect, useState } from 'react'

export default function useTypewriter(text = '', speed = 80) {
  const [i, setI] = useState(0)

  useEffect(() => {
    // reset on new text
    setI(0)
    if (!text) return

    const id = setInterval(() => {
      setI(v => {
        if (v >= text.length) {
          clearInterval(id)
          return v
        }
        return v + 1
      })
    }, speed)

    return () => clearInterval(id)
  }, [text, speed])

  /* we *derive* the string, we don’t build it */
  return text.slice(0, i)
}
