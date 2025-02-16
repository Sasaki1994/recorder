import { useAtom, atom } from 'jotai'
import { useEffect } from 'react'

interface UseDeviceSettings {
  devicesOn: boolean[]
  switchDeviceOn: (index: number) => void
}

const deviceOnAtom = atom<boolean[]>([])

const useDeviceSettings = (devices: MediaDeviceInfo[]): UseDeviceSettings => {
  const [devicesOn, setDevicesOn] = useAtom(deviceOnAtom)

  useEffect(() => {
    setDevicesOn(devices.map(() => true))
  }, [devices])

  const switchDeviceOn = (index: number): void => {
    setDevicesOn((prev) => {
      const newDevicesOn = [...prev]
      newDevicesOn[index] = !newDevicesOn[index]
      return newDevicesOn
    })
  }

  return { devicesOn, switchDeviceOn }
}

export default useDeviceSettings
