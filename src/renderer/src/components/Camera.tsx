import React, { useEffect, useRef, useState } from 'react'
import { Rnd } from 'react-rnd'
import { useInterval } from 'react-use'
import { drawGrid } from '../utils/drawGrid'
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap'
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap'

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
  slowMode?: boolean
  focus?: boolean
  rotateDeg?: number
  gridOn?: boolean
  canvasSize?: {
    width: number
    height: number
  }
}

const Camera: React.FC<CameraProps> = ({
  videoStream,
  initialProps,
  zIndex,
  onDragStart,
  delayTime,
  stopStream,
  slowMode,
  focus,
  rotateDeg,
  gridOn,
  canvasSize
}) => {
  const [focusOn, setFocusOn] = useState(false)
  const [zoomUp, setZoomUp] = useState(false)
  const [zoomdownPrpos, setZoomdownProps] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const captureRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dImagesRef = useRef<string[]>([])
  const delayedCanvasRef = useRef<HTMLCanvasElement>(null)
  const rndRef = useRef<Rnd>(null)
  const recordingTime = 60 // seconds
  const frameRate = 10 // fps
  const slowRate = 5
  const savedImageCount = recordingTime * frameRate + 5 // 5フレームのバッファ
  const img = new Image()
  useEffect(() => {
    img.onload = (): void => {
      const delayedCtx = delayedCanvasRef.current!.getContext('2d')
      if (delayedCtx) {
        delayedCtx.drawImage(img, 0, 0)
        img.src = dImagesRef.current[0]
      }
    }
  }, [])

  useEffect(() => {
    if (videoStream && captureRef.current) {
      captureRef.current.srcObject = videoStream
    }
  }, [videoStream])

  useEffect(() => {
    setFocusOn(!!focus)
  }, [focus])

  useInterval(
    () => {
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
            const url = canvasRef.current.toDataURL('image/jpeg', 0.85)
            dImagesRef.current = [url, ...dImagesRef.current]
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
            delayedCtx.drawImage(img, 0, 0)
            img.src = dImagesRef.current[delayTime * frameRate]
            // グリッド線を描画
            if (gridOn) {
              drawGrid(delayedCtx, delayedCanvasRef.current.width, delayedCanvasRef.current.height)
            }
          }
        }
      }
    },
    (1000 / frameRate) * (slowMode && delayTime && delayTime > 0 ? slowRate : 1)
  )

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
      enableResizing={!zoomUp}
      style={{
        backgroundColor: 'rgb(15, 15, 15)',
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
      {!zoomUp ? (
        <ZoomOutMapIcon
          style={{
            position: 'absolute',
            bottom: 14,
            right: 24,
            color: 'white',
            cursor: 'pointer'
          }}
          onMouseEnter={() => {
            onDragStart?.()
            if (rndRef.current) {
              setZoomUp(true)
              setZoomdownProps({
                x: rndRef.current?.getSelfElement()?.getBoundingClientRect().left ?? 0,
                y: rndRef.current?.getSelfElement()?.getBoundingClientRect().top ?? 0,
                width: rndRef.current?.getSelfElement()?.clientWidth ?? 0,
                height: rndRef.current?.getSelfElement()?.clientHeight ?? 0
              })
              rndRef.current.updatePosition({
                x: 0,
                y: 0
              })
              rndRef.current.updateSize({
                width: canvasSize?.width ?? window.innerWidth,
                height: canvasSize?.height ?? window.innerHeight
              })
            }
          }}
        />
      ) : (
        <ZoomInMapIcon
          style={{
            position: 'absolute',
            top: 14,
            right: 24,
            color: 'white',
            cursor: 'pointer'
          }}
          onMouseEnter={() => {
            onDragStart?.()
            if (rndRef.current) {
              setZoomUp(false)
              rndRef.current.updateSize({
                width: zoomdownPrpos.width,
                height: zoomdownPrpos.height
              })
              rndRef.current.updatePosition({
                x: zoomdownPrpos.x,
                y: zoomdownPrpos.y
              })
            }
          }}
        />
      )}
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
