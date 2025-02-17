
import { useCallback, useEffect, useRef, useState } from "react"

export const SplashCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const { clientX, clientY } = event
      const { left, top } = ref.current?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
      }

      setPosition({
        x: clientX - left,
        y: clientY - top,
      })

      const target = event.target as HTMLElement
      setIsPointer(getComputedStyle(target).cursor === "pointer")
    },
    [ref]
  )

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove)
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [handlePointerMove])

  return (
    <div ref={ref} className="relative h-full w-full">
      <div
        className="pointer-events-none fixed inset-0 z-50 transition duration-300"
        style={{
          background: `radial-gradient(600px at ${position.x}px ${position.y}px, ${
            isPointer ? "rgba(120, 119, 198, 0.15)" : "rgba(120, 119, 198, 0.05)"
          }, transparent)`,
        }}
      />
    </div>
  )
}
