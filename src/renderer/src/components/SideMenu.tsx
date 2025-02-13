import React from 'react'
import { Property } from 'csstype'
import RestoreIcon from '@mui/icons-material/Restore'
import Slider from '@mui/material/Slider'
import useTimeshift from '../hooks/useTimeshift'

interface SideMenuProps {
  width: Property.Width<string | number> | undefined
}

const SideMenu: React.FC<SideMenuProps> = ({ width }) => {
  const { mode, switchMode, delayTime, setDelayTime } = useTimeshift()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '50px',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        width,
        height: '100vh',
        backgroundColor: '#1b1b1f',
        borderRight: '1px solid #2c2c2e'
      }}
    >
      <RestoreIcon
        sx={{ fontSize: 40 }}
        style={{
          color: mode === 'preview' ? '#e0e0e0' : '#e03c3c',
          cursor: 'pointer'
        }}
        onClick={() => {
          switchMode()
        }}
      />
      <Slider
        style={{
          width: '50px',
          marginBottom: '40px'
        }}
        track="inverted"
        aria-label="timeshift seconds"
        defaultValue={-5}
        value={mode === 'preview' ? 0 : -1 * delayTime}
        step={5}
        min={-30}
        max={0}
        onChange={(_event, value) => {
          setDelayTime(-1 * (value as number))
        }}
        valueLabelDisplay="auto"
        disabled={mode === 'preview'}
      />
    </div>
  )
}

export default SideMenu
