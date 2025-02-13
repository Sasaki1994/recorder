import React, { useState } from 'react'
import Camera from '../components/Camera'
import testVideo from '../assets/test.mov'
import useTimeshift from '../hooks/useTimeshift'

const CameraCanvas: React.FC = () => {
  const [zIndexes, setZindexes] = useState<number[]>([0, 0, 0])
  const takeTop = (index: number): void => {
    const newZIndexes = [...zIndexes]
    newZIndexes[index] = Math.max(...zIndexes) + 1
    setZindexes(newZIndexes)
  }
  const { mode, delayTime } = useTimeshift()
  return (
    <div>
      <Camera
        videoSrc={testVideo}
        backgroundColor="rgb(255, 126, 126)"
        zIndex={zIndexes[0]}
        onDragStart={() => {
          takeTop(0)
        }}
        delayTime={mode == 'preview' ? 0 : delayTime}
      />
    </div>
  )
}

export default CameraCanvas
