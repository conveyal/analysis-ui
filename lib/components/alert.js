import React from 'react'

export default function Alert(p) {
  if (!p.text) return null
  return (
    <div className={`alert alert-${p.style || 'info'}`}>
      {p.onClear && (
        <a className='close' onClick={p.onClear}>
          &times;
        </a>
      )}
      <span
        dangerouslySetInnerHTML={{
          __html: p.text
        }}
      />
    </div>
  )
}
