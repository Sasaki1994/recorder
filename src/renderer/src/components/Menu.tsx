import React from 'react'
import { Property } from 'csstype'
import RestoreIcon from '@mui/icons-material/Restore'
import Slider from '@mui/material/Slider'
import useTimeshift from '../hooks/useTimeshift'

interface SideMenuProps {
  height: Property.Height<string | number> | undefined
}

const Menu: React.FC<SideMenuProps> = ({ height }) => {
  const { mode, switchMode, delayTime, setDelayTime } = useTimeshift()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: '30px',
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 1000,
        width: '100vw',
        height,
        backgroundColor: '#1b1b1f',
        borderTop: '3px solid #2c2c2e'
      }}
    >
      <Slider
        style={{
          width: '60vw'
        }}
        track="inverted"
        aria-label="timeshift seconds"
        defaultValue={-5}
        value={mode === 'preview' ? 0 : -1 * delayTime}
        // step={5}
        min={-30}
        max={0}
        onChange={(_event, value) => {
          setDelayTime(-1 * (value as number))
        }}
        valueLabelDisplay="auto"
        disabled={mode === 'preview'}
      />
      <div style={{ width: '40px' }}>
        <RestoreIcon
          sx={{ fontSize: 40 }}
          style={{
            color: mode === 'preview' ? '#e0e0e0' : '#e03c3c',
            cursor: 'pointer'
            // display: 'none'
          }}
          onClick={() => {
            switchMode()
          }}
        />
      </div>
    </div>
  )
}

export default Menu
