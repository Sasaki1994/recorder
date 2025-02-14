import { useEffect, useState } from 'react'
import Menu from './components/Menu'
import CameraCanvas from './components/CameraCanvas'

function App(): JSX.Element {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === 'videoinput')
      setVideoDevices(videoDevices)
    })
  }, [])
  return (
    <div>
      <Menu height={80} />
      <CameraCanvas videoDevices={videoDevices} />
    </div>
  )
}

export default App
