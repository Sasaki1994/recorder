import { useAtom, atom } from 'jotai'
import { useEffect } from 'react'

interface UseDeviceSettings {
  devicesOn: boolean[]
  switchDeviceOn: (index: number) => void
  rotateDegs: number[]
  Rotate: (index: number) => void
  gridOn: boolean
  switchGridOn: () => void
}

const deviceOnAtom = atom<boolean[]>([])
const rotateDegsAtom = atom<number[]>([])
const gridOnAtom = atom<boolean>(false)

const useDeviceSettings = (devices: MediaDeviceInfo[]): UseDeviceSettings => {
  const [devicesOn, setDevicesOn] = useAtom(deviceOnAtom)
  const [rotateDegs, setRotateDegs] = useAtom(rotateDegsAtom)
  const [gridOn, setGridOn] = useAtom(gridOnAtom)

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

  useEffect(() => {
    setRotateDegs((prev) => {
      const newRotateDegs = [...prev]
      if (devices.length > prev.length) {
        newRotateDegs.push(...Array(devices.length - prev.length).fill(0))
      }
      return newRotateDegs
    })
  }, [devices])

  const switchDeviceOn = (index: number): void => {
    setDevicesOn((prev) => {
      const newDevicesOn = [...prev]
      newDevicesOn[index] = !newDevicesOn[index]
      return newDevicesOn
    })
  }

  const Rotate = (index: number): void => {
    setRotateDegs((prev) => {
      const newRotateDegs = [...prev]
      newRotateDegs[index] = newRotateDegs[index] + 90
      return newRotateDegs
    })
  }

  const switchGridOn = (): void => {
    setGridOn((prev) => !prev)
  }

  return { devicesOn, switchDeviceOn, rotateDegs, Rotate, gridOn, switchGridOn }
}

export default useDeviceSettings
