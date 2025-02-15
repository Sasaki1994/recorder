import React from 'react'
import { Property } from 'csstype'
import Slider from '@mui/material/Slider'
import useTimeshift from '../hooks/useTimeshift'
import { PlayCircle, PauseCircle } from '@mui/icons-material'

interface SideMenuProps {
  height: Property.Height<string | number> | undefined
}

const Menu: React.FC<SideMenuProps> = ({ height }) => {
  const { mode, switchMode, delayTime, setDelayTime, switchStopStream, stopStream } = useTimeshift()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: '20px',
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
        value={-1 * delayTime}
        min={-60}
        max={0}
        onChange={(_event, value) => {
          setDelayTime(-1 * (value as number))
          if (value === 0) {
            switchMode('preview')
            if (stopStream) {
              switchStopStream()
            }
          } else {
            switchMode('timeshift')
          }
        }}
        valueLabelDisplay="auto"
      />
      <div style={{ width: '40px' }}>
        {stopStream ? (
          <PlayCircle
            sx={{ fontSize: 40 }}
            style={{
              display: mode === 'preview' ? 'none' : '',
              color: '#e0e0e0',
              cursor: 'pointer'
            }}
            onClick={() => {
              switchStopStream()
            }}
          />
        ) : (
          <PauseCircle
            sx={{ fontSize: 40 }}
            style={{
              display: mode === 'preview' ? 'none' : '',
              color: '#e0e0e0',
              cursor: 'pointer'
            }}
            onClick={() => {
              switchStopStream()
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Menu
