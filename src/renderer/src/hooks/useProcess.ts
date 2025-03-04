interface UseProcess {
  shutdown: () => void
}

const useProcess = (): UseProcess => {
  const shutdown = (): void => {
    window.electron.ipcRenderer.invoke('quit')
  }

  return { shutdown }
}

export default useProcess
