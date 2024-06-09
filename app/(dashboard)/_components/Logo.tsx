import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <Image
    height={110}
    width={110}
    alt ='logo'
    src='/logo.svg'
    />
  )
}
