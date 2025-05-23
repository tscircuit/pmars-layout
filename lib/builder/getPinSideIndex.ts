import type { Side } from "lib/input-types"
import { SIDES_CCW } from "./circuit-types"

/**
 * Maps a pin number to its side and index on that side.
 *
 * Examples:
 * ```
 * getPinSideIndex(1, { leftPinCount: 2, rightPinCount: 2 })
 * // Returns: { side: "left", indexOnSide: 0 }
 *
 * getPinSideIndex(2, { leftPinCount: 2, rightPinCount: 2 })
 * // Returns: { side: "left", indexOnSide: 1 }
 *
 * getPinSideIndex(3, { leftPinCount: 2, rightPinCount: 2 })
 * // Returns: { side: "right", indexOnSide: 0 }
 *
 * getPinSideIndex(4, { leftPinCount: 2, rightPinCount: 2 })
 * // Returns: { side: "right", indexOnSide: 1 }
 * ```
 */
export const getPinSideIndex = (
  pinNumber: number,
  chipDimensions: {
    leftPinCount?: number
    rightPinCount?: number
    topPinCount?: number
    bottomPinCount?: number
  },
): {
  side: Side
  indexOnSide: number
  indexFromTop?: number
  indexFromLeft?: number
} => {
  let currentSideIndex = 0
  let currentIndexOnSide = 0
  for (let i = 0; i < pinNumber && currentSideIndex < 4; ) {
    const currentSide = SIDES_CCW[currentSideIndex]
    const currentSideDimensions =
      chipDimensions[`${currentSide}PinCount` as keyof typeof chipDimensions]

    if (currentSideDimensions === undefined || currentSideDimensions === 0) {
      currentSideIndex++
      continue
    }

    if (currentIndexOnSide >= currentSideDimensions) {
      currentSideIndex++
      currentIndexOnSide = 0
      continue
    }

    if (i + 1 === pinNumber) {
      const result: any = {
        side: currentSide!,
        indexOnSide: currentIndexOnSide,
      }
      if (currentSide === "left") {
        result.indexFromTop = currentIndexOnSide
      } else if (currentSide === "right") {
        result.indexFromTop =
          chipDimensions.rightPinCount! - currentIndexOnSide - 1
      }
      if (currentSide === "bottom") {
        result.indexFromLeft = currentIndexOnSide
      } else if (currentSide === "top") {
        result.indexFromLeft =
          chipDimensions.topPinCount! - currentIndexOnSide - 1
      }
      return result
    }

    currentIndexOnSide++
    i++
  }

  throw new Error(
    `Pin number out of bounds: ${pinNumber} with dimensions left=${chipDimensions.leftPinCount}, right=${chipDimensions.rightPinCount}, top=${chipDimensions.topPinCount}, bottom=${chipDimensions.bottomPinCount}`,
  )
}
