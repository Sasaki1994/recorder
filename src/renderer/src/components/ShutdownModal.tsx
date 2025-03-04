import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

interface ShutdownModalProps {
  show: boolean
  onHide: () => void
  onShutdown: () => void
}

const messages = {
  title: '終了',
  content: 'アプリを終了します。よろしいですか？',
  cancel: 'キャンセル',
  shutdown: '終了'
}

const ShutdownModal: React.FC<ShutdownModalProps> = ({ show, onHide, onShutdown }) => {
  return (
    <Dialog open={show} onClose={onHide}>
      <DialogTitle>{messages.title}</DialogTitle>
      <DialogContent>
        <p>{messages.content}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onHide} color="primary">
          {messages.cancel}
        </Button>
        <Button onClick={onShutdown} color="secondary">
          {messages.shutdown}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShutdownModal
