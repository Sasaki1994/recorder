import React from 'react'
import { Rnd } from 'react-rnd'

interface CameraProps {
  videoSrc?: string
  backgroundColor?: string
  zIndex?: number
  onDragStart?: () => void
}

const Camera: React.FC<CameraProps> = ({ videoSrc, backgroundColor, zIndex, onDragStart }) => {
  const [focusOn, setFocusOn] = React.useState(false)
  return (
    <Rnd
      onDragStart={() => {
        setFocusOn(true)
        onDragStart?.()
      }}
      onDragStop={() => {
        setFocusOn(false)
      }}
      onResizeStart={() => {
        setFocusOn(true)
      }}
      onResizeStop={() => {
        setFocusOn(false)
      }}
      style={{
        backgroundColor: backgroundColor ?? 'rgba(158, 158, 158, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: zIndex ?? 0,
        border: focusOn ? '3px solid rgb(0, 30, 255)' : 'none',
        overflow: 'hidden'
      }}
      default={{
        x: 0,
        y: 0,
        width: 640,
        height: 320
      }}
    >
      {videoSrc ? (
        <video
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          src={videoSrc}
          autoPlay
          loop
          muted
        />
      ) : (
        <p style={{ fontSize: 24 }}>{'Device not available'}</p>
      )}
    </Rnd>
  )
}

export default Camera
