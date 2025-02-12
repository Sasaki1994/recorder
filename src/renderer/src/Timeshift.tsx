import { useRef, useState } from 'react'
import { useInterval } from 'react-use'

function Timeshift(): JSX.Element {
  const captureRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dImagesRef = useRef<ImageData[]>([])
  const delayedCanvasRef = useRef<HTMLCanvasElement>(null)
  const [config, setConfig] = useState<Config | undefined>()
  const delayTime = 5 // seconds
  const frameRate = 30 // fps
  const savedImageCount = delayTime * frameRate

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
        dImagesRef.current = [
          ...dImagesRef.current,
          ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
        ]
      }

      if (delayedCanvasRef.current && dImagesRef.current.length > savedImageCount) {
        delayedCanvasRef.current.width = captureRef.current.videoWidth
        delayedCanvasRef.current.height = captureRef.current.videoHeight
        const delayedCtx = delayedCanvasRef.current.getContext('2d')
        if (delayedCtx) {
          delayedCtx.putImageData(dImagesRef.current[0], 0, 0)
          dImagesRef.current.shift()
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
