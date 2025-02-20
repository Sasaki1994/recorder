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
    // 元々のdevicesOnの値を保ちつつ、devicesの長さだけtrueを追加
    setDevicesOn((prev) => {
      const newDevicesOn = [...prev]
      if (devices.length > prev.length) {
        newDevicesOn.push(...Array(devices.length - prev.length).fill(true))
      }
      return newDevicesOn
    })
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
