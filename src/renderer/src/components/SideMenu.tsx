import React from 'react'
import { Property } from 'csstype'

interface SideMenuProps {
  width: Property.Width<string | number> | undefined
  timeshiftState: string
}

const SideMenu: React.FC<SideMenuProps> = ({ width, timeshiftState }) => {
  return (
    <div
      style={{
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
      <button
        onClick={() => {
          window.api.switchTimeshift()
          window.api.openTimeshift('visible')
        }}
        style={{
          position: 'relative',
          zIndex: 1001
        }}
      >
        Open & Close
      </button>
      <p>{timeshiftState}</p>
    </div>
  )
}

export default SideMenu
