import React, { useEffect } from 'react'

export default function Toast({ type = 'info', text = '', duration = 3000, onClose = () => {} }) {
  useEffect(() => {
    const id = setTimeout(onClose, duration)
    return () => clearTimeout(id)
  }, [duration, onClose])

  return (
    <div className={`toast ${type}`} role="status">
      {text}
      <button className="toast-close" onClick={onClose} aria-label="close">×</button>
    </div>
  )
}
