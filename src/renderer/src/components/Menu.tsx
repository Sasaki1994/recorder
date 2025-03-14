import React, { useState } from 'react'
import { Property } from 'csstype'
import Slider from '@mui/material/Slider'
import useTimeshift from '../hooks/useTimeshift'
import { PlayCircle, PauseCircle } from '@mui/icons-material'
import SpeedIcon from '@mui/icons-material/Speed'
import RefreshIcon from '@mui/icons-material/Refresh'
import GridOnIcon from '@mui/icons-material/GridOn'
import GridOffIcon from '@mui/icons-material/GridOff'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import useDeviceSettings from '../hooks/useDeviceSettings'
import MaterialMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw'

import ListIcon from '@mui/icons-material/List'
import useProcess from '@renderer/hooks/useProcess'
import ShutdownModal from './ShutdownModal'

interface SideMenuProps {
  height: Property.Height<string | number> | undefined
  videoDevices: MediaDeviceInfo[]
  onRefresh?: () => void
}

const Menu: React.FC<SideMenuProps> = ({ height, videoDevices, onRefresh }) => {
  const {
    mode,
    switchMode,
    delayTime,
    setDelayTime,
    switchStopStream,
    stopStream,
    slowMode,
    switchSlowMode
  } = useTimeshift()
  const { devicesOn, switchDeviceOn, Rotate, gridOn, switchGridOn } =
    useDeviceSettings(videoDevices)
  const { shutdown } = useProcess()

  const [openShutdownModal, setOpenShutdownModal] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (): void => {
    setAnchorEl(null)
  }
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
      <div style={{ width: '40px', marginRight: '120px' }}>
        <PowerSettingsNewIcon
          sx={{ fontSize: 40 }}
          style={{
            color: '#e0e0e0',
            cursor: 'pointer'
          }}
          onClick={() => {
            setOpenShutdownModal(true)
          }}
        />
        <ShutdownModal
          show={openShutdownModal}
          onHide={() => setOpenShutdownModal(false)}
          onShutdown={shutdown}
        />
      </div>
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
      <div style={{ width: '40px' }}>
        {slowMode ? (
          <SpeedIcon
            sx={{ fontSize: 40 }}
            style={{
              display: mode === 'preview' ? 'none' : '',
              cursor: 'pointer'
            }}
            color="primary"
            onClick={() => {
              switchSlowMode()
            }}
          />
        ) : (
          <SpeedIcon
            sx={{ fontSize: 40 }}
            style={{
              display: mode === 'preview' ? 'none' : '',
              color: '#e0e0e0',
              cursor: 'pointer'
            }}
            color="primary"
            onClick={() => {
              switchSlowMode()
            }}
          />
        )}
      </div>
      <div style={{ width: '40px' }}>
        {gridOn ? (
          <GridOnIcon
            sx={{ fontSize: 40 }}
            style={{
              color: '#e0e0e0',
              cursor: 'pointer'
            }}
            onClick={() => {
              switchGridOn()
            }}
          />
        ) : (
          <GridOffIcon
            sx={{ fontSize: 40 }}
            style={{
              color: '#e0e0e0',
              cursor: 'pointer'
            }}
            onClick={() => {
              switchGridOn()
            }}
          />
        )}
      </div>
      <div style={{ width: '40px' }}>
        <div aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
          <ListIcon sx={{ fontSize: 40, color: '#e0e0e0', cursor: 'pointer' }} />
        </div>
        <MaterialMenu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {videoDevices.map((device, i) => (
            <MenuItem key={i} style={{ cursor: 'default' }}>
              <Switch checked={devicesOn[i]} onClick={() => switchDeviceOn(i)} />
              <Rotate90DegreesCwIcon
                sx={{ marginRight: 3, marginLeft: 2 }}
                style={{ cursor: devicesOn[i] ? 'pointer' : 'default' }}
                color={devicesOn[i] ? 'action' : 'disabled'}
                onClick={() => {
                  if (devicesOn[i]) {
                    Rotate(i)
                  }
                }}
              />
              {device.label}
            </MenuItem>
          ))}
        </MaterialMenu>
      </div>
      <div style={{ width: '40px' }}>
        <RefreshIcon
          sx={{ fontSize: 40 }}
          style={{
            color: '#e0e0e0',
            cursor: 'pointer'
          }}
          onClick={() => {
            onRefresh?.()
          }}
        />
      </div>
    </div>
  )
}

export default Menu
