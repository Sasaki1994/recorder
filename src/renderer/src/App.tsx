import { useState } from 'react'
import SideMenu from './components/SideMenu'
import CameraCanvas from './components/CameraCanvas'

function App(): JSX.Element {
  const [timeshiftState, setTimeshiftState] = useState<string>('')
  const [width, setWidth] = useState<number | undefined>()

  window.api.openTimeshift()

  window.api.recieveTimeshiftState((_event, state) => {
    setTimeshiftState(state)
  })

  window.api.recieveConfig((_event, config) => {
    setWidth(config.sideWidth)
  })

  return (
    <div>
      <SideMenu width={width} timeshiftState={timeshiftState} />
      <CameraCanvas />
    </div>
  )
}

export default App
