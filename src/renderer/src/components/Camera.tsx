import React, { useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import { useInterval } from 'react-use'

interface CameraProps {
  videoStream?: MediaStream
  initialPosition?: { x: number; y: number }
  zIndex?: number
  onDragStart?: () => void
  delayTime?: number
}

const Camera: React.FC<CameraProps> = ({
  videoStream,
  initialPosition,
  zIndex,
  onDragStart,
  delayTime
}) => {
  const [focusOn, setFocusOn] = React.useState(false)
  const captureRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dImagesRef = useRef<ImageData[]>([])
  const delayedCanvasRef = useRef<HTMLCanvasElement>(null)
  const recordingTime = 30 // seconds
  const frameRate = 30 // fps
  const savedImageCount = recordingTime * frameRate + 5 // 5フレームのバッファ

  useEffect(() => {
    if (videoStream && captureRef.current) {
      captureRef.current.srcObject = videoStream
    }
  }, [videoStream])

  useInterval(() => {
    if (captureRef.current && canvasRef.current) {
      canvasRef.current.width = captureRef.current.videoWidth
      canvasRef.current.height = captureRef.current.videoHeight
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.drawImage(captureRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        // 先頭フレームとして追加
        dImagesRef.current = [
          ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height),
          ...dImagesRef.current
        ]
      }
      if (dImagesRef.current.length > savedImageCount) {
        dImagesRef.current.pop()
      }

      // delaytime前の画像を表示
      if (
        delayedCanvasRef.current &&
        delayTime &&
        dImagesRef.current.length > delayTime * frameRate
      ) {
        delayedCanvasRef.current.width = captureRef.current.videoWidth
        delayedCanvasRef.current.height = captureRef.current.videoHeight
        const delayedCtx = delayedCanvasRef.current.getContext('2d')
        if (delayedCtx) {
          delayedCtx.putImageData(dImagesRef.current[delayTime * frameRate], 0, 0)
        }
      }
    }
  }, 1000 / frameRate)

  return (
    <Rnd
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: zIndex ?? 0,
        border: focusOn ? '3px solid rgb(0, 30, 255)' : 'none',
        overflow: 'hidden'
      }}
      default={{
        x: -300 + (initialPosition?.x ?? 0),
        y: -300 + (initialPosition?.y ?? 0),
        width: 640,
        height: 320
      }}
    >
      {videoStream ? (
        <>
          <video
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: delayTime && delayTime > 0 ? 'none' : 'block'
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
              display: delayTime && delayTime > 0 ? 'block' : 'none',
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
