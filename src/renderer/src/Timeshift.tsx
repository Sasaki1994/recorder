import { useRef, useState } from 'react'
import { useInterval } from 'react-use'

function Timeshift(): JSX.Element {
  const captureRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dImagesRef = useRef<ImageData[]>([])
  const delayedCanvasRef = useRef<HTMLCanvasElement>(null)
  const [config, setConfig] = useState<Config | undefined>()
  const [delayTime, setDelayTime] = useState<number>(0)
  const recordingTime = 30 // seconds
  const frameRate = 30 // fps
  const savedImageCount = recordingTime * frameRate + 5 // 5フレームのバッファ

  window.api.recieveConfig((_event, config) => {
    setConfig(config)

    navigator.mediaDevices
      .getDisplayMedia({
        audio: false,
        video: {
          width: config?.mainWindow.width,
          height: config?.mainWindow.height,
          frameRate
        }
      })
      .then((stream) => {
        if (captureRef.current && canvasRef.current && delayedCanvasRef.current) {
          captureRef.current.srcObject = stream
          captureRef.current.play()
        }
      })
      .catch((e) => console.log(e))
  })

  window.api.receiveMenuProps((_event, ps) => {
    setDelayTime(-1 * ps.delayTime)
  })

  useInterval(() => {
    if (captureRef.current && canvasRef.current && config) {
      canvasRef.current.width = captureRef.current.videoWidth
      canvasRef.current.height = captureRef.current.videoHeight
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.drawImage(
          captureRef.current,
          (-1 * config?.sideWidth) / 2,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )
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
      if (delayedCanvasRef.current && dImagesRef.current.length > delayTime * frameRate) {
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
    <>
      <video
        style={{
          display: 'none',
          width: config?.mainWindow.width,
          height: config?.mainWindow.height
        }}
        ref={captureRef}
      />
      <canvas style={{ display: 'none' }} ref={canvasRef} />
      <canvas style={{ display: '' }} ref={delayedCanvasRef} />
    </>
  )
}

export default Timeshift
