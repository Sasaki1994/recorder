import React, { useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import { useInterval } from 'react-use'
import { drawGrid } from '../utils/drawGrid'

interface CameraProps {
  videoStream?: MediaStream | null
  initialProps?: {
    x: number
    y: number
    width: number
    height: number
  }
  zIndex?: number
  onDragStart?: () => void
  delayTime?: number
  stopStream?: boolean
  focus?: boolean
  rotateDeg?: number
  gridOn?: boolean
}

const Camera: React.FC<CameraProps> = ({
  videoStream,
  initialProps,
  zIndex,
  onDragStart,
  delayTime,
  stopStream,
  focus,
  rotateDeg,
  gridOn
}) => {
  const [focusOn, setFocusOn] = React.useState(false)
  const captureRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dImagesRef = useRef<ImageData[]>([])
  const delayedCanvasRef = useRef<HTMLCanvasElement>(null)
  const rndRef = useRef<Rnd>(null)
  const recordingTime = 60 // seconds
  const frameRate = 10 // fps
  const savedImageCount = recordingTime * frameRate + 5 // 5フレームのバッファ

  useEffect(() => {
    if (videoStream && captureRef.current) {
      captureRef.current.srcObject = videoStream
    }
  }, [videoStream])

  useEffect(() => {
    setFocusOn(!!focus)
  }, [focus])

  useInterval(() => {
    if (captureRef.current && canvasRef.current) {
      canvasRef.current.width = captureRef.current.videoWidth
      canvasRef.current.height = captureRef.current.videoHeight
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        if (rotateDeg) {
          ctx.translate(canvasRef.current.width / 2, canvasRef.current.height / 2)
          ctx.rotate((rotateDeg * Math.PI) / 180)
          ctx.translate(-canvasRef.current.width / 2, -canvasRef.current.height / 2)
        }
        ctx.drawImage(captureRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        // 先頭フレームとして追加
        if (!stopStream) {
          dImagesRef.current = [
            ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height),
            ...dImagesRef.current
          ]
        }
      }
      if (!stopStream && dImagesRef.current.length > savedImageCount) {
        dImagesRef.current.pop()
      }

      // delaytime前の画像を表示
      if (
        delayedCanvasRef.current &&
        delayTime !== undefined &&
        dImagesRef.current.length > delayTime * frameRate
      ) {
        delayedCanvasRef.current.width = captureRef.current.videoWidth
        delayedCanvasRef.current.height = captureRef.current.videoHeight
        const delayedCtx = delayedCanvasRef.current.getContext('2d')
        if (delayedCtx) {
          delayedCtx.putImageData(dImagesRef.current[delayTime * frameRate], 0, 0)
          // グリッド線を描画
          if (gridOn) {
            drawGrid(delayedCtx, delayedCanvasRef.current.width, delayedCanvasRef.current.height)
          }
        }
      }
    }
  }, 1000 / frameRate)

  useEffect(() => {
    if (rndRef.current && rotateDeg) {
      const elem = rndRef.current.getSelfElement()
      if (!elem) return
      rndRef.current.updateSize({
        width: elem.clientHeight,
        height: elem.clientWidth
      })
    }
  }, [rotateDeg])

  return (
    <Rnd
      ref={rndRef}
      onDragStart={() => {
        setFocusOn(true)
        onDragStart?.()
      }}
      onDragStop={() => {
        setFocusOn(false)
      }}
      onResizeStart={() => {
        setFocusOn(true)
      }}
      onResizeStop={() => {
        setFocusOn(false)
      }}
      style={{
        backgroundColor: 'rgb(116, 116, 116)',
        display: videoStream ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: zIndex ?? 0,
        border: focusOn ? '3px solid rgb(0, 30, 255)' : 'none',
        overflow: 'hidden'
      }}
      default={{
        x: (-1 * (initialProps?.width ?? 480)) / 4 + (initialProps?.x ?? 0),
        y: (-1 * (initialProps?.height ?? 270)) / 4 + (initialProps?.y ?? 0),
        width: initialProps?.width ?? 480,
        height: initialProps?.height ?? 270
      }}
    >
      {videoStream ? (
        <>
          <video
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'none'
            }}
            autoPlay
            loop
            muted
            ref={captureRef}
          />
          <canvas
            style={{
              display: 'none',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            ref={canvasRef}
          />
          <canvas
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            ref={delayedCanvasRef}
          />
        </>
      ) : (
        <p style={{ fontSize: 24 }}>{'Device not available'}</p>
      )}
    </Rnd>
  )
}

export default Camera
