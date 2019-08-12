import React from 'react'

export default function FlexContainer(p) {
  return (
    <div className='flex-container'>
      {p.children}

      <style jsx>{`
        .flex-container {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          display: flex;
          flex-wrap: nowrap;
        }
      `}</style>
    </div>
  )
}
