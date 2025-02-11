import { useState } from 'react'
import Camera from './components/Camera'
import testVideo from './assets/test.mov'

function App(): JSX.Element {
  const [zIndexes, setZindexes] = useState<number[]>([0, 0, 0])
  const takeTop = (index: number): void => {
    const newZIndexes = [...zIndexes]
    newZIndexes[index] = Math.max(...zIndexes) + 1
    setZindexes(newZIndexes)
  }

  return (
    <>
      <Camera
        videoSrc={testVideo}
        backgroundColor="rgb(255, 126, 126)"
        zIndex={zIndexes[0]}
        onDragStart={() => {
          takeTop(0)
        }}
      />
      <Camera
        videoSrc={testVideo}
        backgroundColor="rgb(255, 126, 126)"
        zIndex={zIndexes[1]}
        onDragStart={() => {
          takeTop(1)
        }}
      />
    </>
  )
}

export default App
