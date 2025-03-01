import { useAtom, atom } from 'jotai'

type Mode = 'preview' | 'timeshift'

interface UseTimeshift {
  mode: Mode
  switchMode: (toMode?: Mode) => void
  delayTime: number
  setDelayTime: (delayTime: number) => void
  stopStream: boolean
  switchStopStream: () => void
  slowMode: boolean
  switchSlowMode: () => void
}

const modeAtom = atom<Mode>('preview')
const delayTimeAtom = atom<number>(0)
const stopStreamAtom = atom<boolean>(false)
const slowModeAtom = atom<boolean>(false)

const useTimeshift = (): UseTimeshift => {
  const [mode, setMode] = useAtom(modeAtom)
  const [delayTime, setDelayTime] = useAtom(delayTimeAtom)
  const [stopStream, setStopStream] = useAtom(stopStreamAtom)
  const [slowMode, setSlowMode] = useAtom(slowModeAtom)

  const switchMode = (toMode?: Mode): void => {
    if (toMode) {
      if (toMode !== mode) {
        setMode(toMode)
      }
      return
    }
    setMode(mode === 'preview' ? 'timeshift' : 'preview')
  }

  const switchStopStream = (): void => {
    setStopStream(!stopStream)
  }

  const switchSlowMode = (): void => {
    setSlowMode(!slowMode)
  }

  return {
    mode,
    switchMode,
    delayTime,
    setDelayTime,
    stopStream,
    switchStopStream,
    slowMode,
    switchSlowMode
  }
}

export default useTimeshift
