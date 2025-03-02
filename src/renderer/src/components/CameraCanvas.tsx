import React, { useEffect, useState } from 'react'
import Camera from '../components/Camera'
import useTimeshift from '../hooks/useTimeshift'
import useDeviceSettings from '../hooks/useDeviceSettings'

interface CameraCanvasProps {
  videoDevices: MediaDeviceInfo[]
  menuHeight: number
}

const CameraCanvas: React.FC<CameraCanvasProps> = ({ videoDevices, menuHeight }) => {
  const [zIndexes, setZindexes] = useState<number[]>(Array(30).fill(0)) // 初期値が必要なので、十分に大きい長さで0埋め
  const initialFrameRefs = React.useRef<Frame[]>([])
  const canvasSize = { width: ((720 - menuHeight) * 16) / 9, height: 720 - menuHeight }
  const takeTop = (index: number): void => {
    const newZIndexes = [...zIndexes]
    newZIndexes[index] = Math.max(...zIndexes) + 1
    setZindexes(newZIndexes)
  }
  const { mode, delayTime, stopStream, slowMode } = useTimeshift()

  const [videoStreams, setVideoStreams] = useState<(MediaStream | null)[]>([])
  const { devicesOn, rotateDegs, gridOn } = useDeviceSettings(videoDevices)
  useEffect(() => {
    if (videoDevices.length === 0) return
    Promise.all(
      videoDevices.map(async (device, i) => {
        if (!devicesOn[i]) {
          return null
        }
        return await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            deviceId: device.deviceId,
            frameRate: { ideal: 10 },
            width: 1280 / videoDevices.length,
            height: 720 / videoDevices.length
          }
        })
      })
    ).then((streams) => {
      setVideoStreams(streams)
      initialFrameRefs.current = getInitialProps(videoDevices.length)
    })
  }, [videoDevices, devicesOn])

  interface Frame {
    width: number
    height: number
    x: number
    y: number
  }

  const getInitialProps = (n: number): Frame[] => {
    const { width, height } = canvasSize
    const frameSize = { width: width / 2, height: height / 2 }

    if (n === 0) return []
    if (n === 1)
      return [{ width: width, height: height - menuHeight, x: 0, y: (-1 * menuHeight) / 8 }]
    if (n === 2)
      return [
        { width: width / 1.8, height: height / 1.8, x: (-1 * width) / 8 - 20, y: 0 },
        { width: width / 1.8, height: height / 1.8, x: width / 8 + 20, y: 0 }
      ]
    return Array(n)
      .fill(frameSize)
      .map((frame, i) => {
        const x = i % 4
        const y = Math.floor(i / 4)
        const framex = (x % 2 === 0 ? (-1 * width) / 8 : width / 8) + y * 10
        const framey =
          (Math.floor(x / 2) === 0
            ? (-1 * height) / 8 - (2 * menuHeight) / 8
            : height / 8 - (2 * menuHeight) / 8) +
          y * 10
        return { ...frame, x: framex, y: framey }
      })
  }
  return (
    <div>
      {videoStreams.map((stream, i) => (
        <Camera
          key={i}
          videoStream={stream}
          zIndex={zIndexes[i]}
          onDragStart={() => {
            takeTop(i)
          }}
          initialProps={initialFrameRefs.current[i]}
          delayTime={mode == 'preview' ? 0 : delayTime}
          stopStream={stopStream}
          slowMode={slowMode}
          rotateDeg={rotateDegs[i]}
          gridOn={gridOn}
          canvasSize={{ width: 1280, height: 720 - menuHeight }}
        />
      ))}
    </div>
  )
}

export default CameraCanvas
