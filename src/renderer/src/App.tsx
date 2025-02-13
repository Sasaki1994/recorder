import SideMenu from './components/SideMenu'
import CameraCanvas from './components/CameraCanvas'

function App(): JSX.Element {
  return (
    <div>
      <SideMenu width={80} />
      <CameraCanvas />
    </div>
  )
}

export default App
