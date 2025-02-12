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
      <button
        style={{ position: 'absolute', top: 0, left: 0 }}
        onClick={() => {
          window.api.openTimeshift()
        }}
      >
        Open!!
      </button>
      <Camera
        videoSrc={testVideo}
        backgroundColor="rgb(255, 126, 126)"
        zIndex={zIndexes[0]}
        onDragStart={() => {
          takeTop(0)
        }}
      />
    </>
  )
}

export default App
