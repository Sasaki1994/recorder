import { useAtom, atom } from 'jotai'

type Mode = 'preview' | 'timeshift'

interface UseTimeshift {
  mode: Mode
  switchMode: () => void
  delayTime: number
  setDelayTime: (delayTime: number) => void
}

const modeAtom = atom<Mode>('preview')
const delayTimeAtom = atom<number>(0)

const useTimeshift = (): UseTimeshift => {
  const [mode, setMode] = useAtom(modeAtom)
  const [delayTime, setDelayTime] = useAtom(delayTimeAtom)

  const switchMode = (): void => {
    setMode(mode === 'preview' ? 'timeshift' : 'preview')
  }

  return { mode, switchMode, delayTime, setDelayTime }
}

export default useTimeshift
