import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import Viewport from './Viewport'

const dt = 15
const scrollSpeed = 200
const timeForQuestion = 3500
const platformHeight = 30
const heightDiff = 200
const cameraHeightChangeDuration = 400
const G = 1000
const jumpStartSpeed = 800
const playerWidth = 100

const createPlatform = (x0, y0) => [x0, y0, x0 + scrollSpeed * timeForQuestion / 1000, y0 + platformHeight]

const createAnswerPlatforms = rect => [
  createPlatform(rect[2], rect[1] - heightDiff - platformHeight),
  createPlatform(rect[2], rect[1] + heightDiff + platformHeight),
]

const startPlatform = createPlatform(0, 0)

const dRects = [
  startPlatform,
  // ...createAnswerPlatforms(startPlatform)
]

const usePrev = value => {
  const ref = useRef()
  useEffect(() => ref.current = value)
  return ref.current
}

const calcLineCoefs = (x0, y0, x1, y1) => {
  const dx = x1 - x0
  const dy = y1 - y0
  const a = dy
  const b = - dx
  const c = - dy * x0 + dx * y0
  return [a, b, c]
}

const calcLineEq = (a, b, c, x, y) => a * x + b * y + c

const isOnWay = (x0, y0, x1, y1, rectX0, rectX1, rectY) => {
  if (y0 > rectY || y1 < rectY) return false
  if (x1 < rectX0 || x1 > rectX1) return false
  const [a, b, c] = calcLineCoefs(x0, y0, x1, y1)
  return Math.sign(calcLineEq(a, b, c, rectX0, rectY) * calcLineEq(a, b, c, rectX1, rectY)) === -1
  
}

class Animation {
  constructor({ from, to, duration }) {
    Object.assign(this, { from, to, duration, start: Date.now() })
  }

  calc = () => {
    const { from, to, start, duration } = this
    const stage = Math.min((Date.now() - start) / duration, 1)
    const value = from + (to - from) * stage
    const isEnded = stage === 1
    return [value, isEnded]
  }
}

class BallisticAnimation {
  constructor({ from, v0, a }) {
    Object.assign(this, { from, v0, a, start: Date.now() })
  }

  calc = () => {
    const { from, v0, a, start } = this
    const dt = Date.now() - start
    const value = from + v0 * dt / 1000 + a * (dt / 1000) ** 2 / 2
    return value
  }
}

const withPrev = f => {
  let px
  return x => {
    const result = f(x, px)
    px = x
    return result
  }
}

class SlidingMedian {
  constructor(n) {
    this.n = n
  }

  cache = []
  value = undefined

  push(value) {
    if (this.cache.length < this.n) {
      this.cache = [...Array(this.n).keys()].map(() => value)
      this.value = value
    } else {
      this.value = this.value + (value - this.cache[0]) / this.n
      this.cache.push(value)
      this.cache.shift()
    }
  }
}

window.SlidingMedian = SlidingMedian

const fpsCounter = new SlidingMedian(60)

const App = () => {
  const [t, setT] = useState(0)
  const prevT = usePrev(t)
  const t0 = useRef(Date.now())
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const [rects, setRects] = useState(dRects)
  const [current, setCurrent] = useState(rects[0])
  const [up, setUp] = useState(rects[1])
  const [down, setDown] = useState(rects[2])
  const [playerY, setPlayerY] = useState(current[1])
  const [animateY, setAnimateY] = useState(null)
  const [playerFalling, setPlayerFalling] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => setT(Date.now() - t0.current), dt)
    document.addEventListener('keypress', jump)
    return () => {
      clearInterval(interval)
      document.removeEventListener('keypress', jump)
    }
  })

  useEffect(() => {
    if (prevT !== undefined && prevT !== t) fpsCounter.push(1000 / (t - prevT))
    const newX = prevT !== undefined ? x + (t - prevT) * scrollSpeed / 1000 : x

    if (!playerFalling && newX > current[2]) {
      setPlayerFalling(new BallisticAnimation({ from: playerY, v0: 0, a: G }))
    }

    if (playerFalling) {
      let newPlayerY = playerFalling.calc()
      if (newPlayerY > playerY) {
        const onRect = [current, up, down].find(rect =>
          isOnWay(x, playerY, newX, newPlayerY, rect[0], rect[2], rect[1]) ||
          isOnWay(x + playerWidth, playerY, newX + playerWidth, newPlayerY, rect[0], rect[2], rect[1])
        )
        if (onRect) {
          if (onRect === up) {
            // up
          }
          if (onRect === down) {
            // down
          }
          setPlayerFalling(null)
          newPlayerY = onRect[1]
          setCurrent(onRect)
        }
      }
      setPlayerY(newPlayerY)
    }

    if (animateY) {
      const [value, isDone] = animateY.calc()
      setY(value)
      if (isDone) {
        setAnimateY(null)
      }
    }

    setX(newX)

  }, [t, x, y, current, up, down, playerY, playerFalling, animateY, prevT])

  useEffect(() => {
    const answerPlatforms = createAnswerPlatforms(current)
    setUp(answerPlatforms[0])
    setDown(answerPlatforms[1])
    setRects([...rects, ...answerPlatforms])
    setAnimateY(new Animation({ from: y, to: current[1], duration: cameraHeightChangeDuration }))
  }, [current])

  const jump = useCallback(() => {
    console.log(playerFalling)
    if (!playerFalling) {
      setPlayerFalling(new BallisticAnimation({ from: playerY, v0: - jumpStartSpeed, a: G }))
    }
  }, [y, playerFalling])

  return (
    <div className="app">
      <Viewport
        x={x}
        y={y}
        playerY={playerY}
        width={700}
        height={700}
        rects={rects}
        onClick={jump}
      />
      <pre className="info">
        Нажми любую клавишу или кликни любое место в игре чтобы прыгнуть.
        <br/>
        Выбирай ответ на вопрос запрыгивая или спускаясь на платформу
        <br/>
        FPS: {fpsCounter.value && fpsCounter.value.toFixed()}
      </pre>
    </div>
  )
}

export default App
