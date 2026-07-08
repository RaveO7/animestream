import Link from 'next/link'
import React from 'react'
import { Separateur } from './Separateur'

export default function Footer() {
    return (
        <footer className='w-full z-50  items-center relative bottom-0'>
            <nav className="w-full flex justify-end text-sm">
                <div className='flex px-2 rounded bg-midnight'>
                    <Link href='/dmca' className='text-timeVideo hover:text-violet-400 hover:underline'>DMCA</Link>
                    <Separateur height={5}/>
                    <Link href='contact' className='text-timeVideo hover:text-violet-400 hover:underline'>Contact</Link>
                </div>
            </nav>
        </footer>
    )
}
