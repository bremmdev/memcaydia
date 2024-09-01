import React from 'react'

export default function Container({children}: { children: React.ReactNode }) {
  return (
    <div className='max-w-7xl mx-auto w-10/12 py-12'>{children}</div>
  )
}
