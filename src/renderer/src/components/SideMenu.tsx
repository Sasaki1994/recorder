import React from 'react'
import { Property } from 'csstype'
import RestoreIcon from '@mui/icons-material/Restore'
import Slider from '@mui/material/Slider'

interface SideMenuProps {
  width: Property.Width<string | number> | undefined
  timeshiftState: string
}

const SideMenu: React.FC<SideMenuProps> = ({ width, timeshiftState }) => {
  const [tshiftValue, setTshiftValue] = React.useState<number>(5)
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
          color: timeshiftState === 'hidden' ? '#e0e0e0' : '#e03c3c',
          cursor: 'pointer'
        }}
        onClick={() => {
          window.api.switchTimeshift()
          window.api.openTimeshift('visible')
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
        value={timeshiftState === 'hidden' ? 0 : tshiftValue}
        step={5}
        min={-30}
        max={0}
        onChange={(_event, value) => {
          setTshiftValue(value as number)
          window.api.sendMenuProps({ delayTime: value as number })
        }}
        valueLabelDisplay="auto"
        disabled={timeshiftState === 'hidden'}
      />
    </div>
  )
}

export default SideMenu
