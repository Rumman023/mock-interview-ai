"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect, useReducer } from 'react'

function Header() {
 
   const path=usePathname();
   useEffect(() => {console.log(path)}, [])   

  return (
    <div className='flex justify-between items-center p-4 bg-secondary shadow-sm'>
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <ul className='hidden md:flex space-x-5'>
            <li className={`hover:text-primary hover:font-semibold transition-all cursor-pointer
                ${path==='/dashboard' && 'text-primary font-semibold'}
                `}>Dashboard</li>
            <li className={`hover:text-primary hover:font-semibold transition-all cursor-pointer
                ${path==='/dashboard/questions' && 'text-primary font-semibold'}
                `}>Questions</li>
            <li className={`hover:text-primary hover:font-semibold transition-all cursor-pointer
                ${path==='/dashboard/upgrade' && 'text-primary font-semibold'}
                `}>Upgrade</li>
            <li className={`hover:text-primary hover:font-semibold transition-all cursor-pointer
                ${path==='/dashboard/how' && 'text-primary font-semibold'}
                `}>How it works?</li>
        </ul>
        <UserButton />
    </div>
  )
}

export default Header