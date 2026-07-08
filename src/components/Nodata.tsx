import Link from 'next/link'
import React from 'react'

export default function Nodata() {
    return (
        <div className='text-center text-5xl'>
            <p className='mb-5'>Aucune donnée</p>
            <button className='
                m-auto
                rounded-lg p-5
                flex items-around items-center justify-center
                overflow-hidden
                text-white bg-violet-700 dark:bg-violet-600 border-transparent
                hover:bg-violet-800 dark:hover:bg-violet-700
                active:text-white active:border-white
                focus:ring-4 focus:outline-none focus:ring-violet-300 dark:focus:ring-violet-800
                duration-300'>
                <Link href={'/'}>Retour à l&apos;accueil</Link>
            </button>
        </div>
    )
}
