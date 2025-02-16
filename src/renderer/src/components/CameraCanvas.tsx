import React, { useEffect, useState } from 'react'
import Camera from '../components/Camera'
import useTimeshift from '../hooks/useTimeshift'
import useDeviceSettings from '../hooks/useDeviceSettings'

interface CameraCanvasProps {
  videoDevices: MediaDeviceInfo[]
}

const CameraCanvas: React.FC<CameraCanvasProps> = ({ videoDevices }) => {
  const [zIndexes, setZindexes] = useState<number[]>(Array(30).fill(0)) // 初期値が必要なので、十分に大きい長さで0埋め
  const takeTop = (index: number): void => {
    const newZIndexes = [...zIndexes]
    newZIndexes[index] = Math.max(...zIndexes) + 1
    setZindexes(newZIndexes)
  }
  const { mode, delayTime, stopStream } = useTimeshift()

  const [videoStreams, setVideoStreams] = useState<(MediaStream | null)[]>([])
  const { devicesOn } = useDeviceSettings(videoDevices)
  useEffect(() => {
    if (videoDevices.length === 0) return
    Promise.all(
      videoDevices.map(async (device, i) => {
        if (!devicesOn[i]) {
          return null
        }
        return await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: device.deviceId,
            frameRate: { ideal: 10 }
          }
        })
      })
    ).then((streams) => {
      setVideoStreams(streams)
    })
  }, [videoDevices, devicesOn])
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
          initialPosition={{ x: 30 * i, y: 30 * i }}
          delayTime={mode == 'preview' ? 0 : delayTime}
          stopStream={stopStream}
        />
      ))}
    </div>
  )
}

export default CameraCanvas
