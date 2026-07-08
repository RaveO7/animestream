import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { upperFirstLetter } from './Utils';
import { X, Menu } from 'lucide-react';

export default function BurgerMenu() {
    const [burgerMenu, setBurgerMenu] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleOutSideClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setBurgerMenu(false)
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => { window.removeEventListener("mousedown", handleOutSideClick); };
    }, []);

    const list: Array<string> = ['studios', 'animes', 'genres']

    return (
        <div ref={ref} className='relative flex flex-col'>
            <button aria-label='Burger Menu Research' type="button"
                className="relative flex items-center justify-center w-10 h-10 rounded-full
                bg-gray-700 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600"
                onClick={() => setBurgerMenu((val) => !val)}>
                <X className={`absolute w-6 h-6 transition-all duration-300 ease-out
                ${burgerMenu ? 'rotate-180 opacity-100' : '-rotate-45 opacity-0 '}`} />
                <Menu className={`absolute w-6 h-6 transition-all duration-300 ease-out 
                ${burgerMenu ? 'rotate-45 opacity-0' : '-rotate-180 opacity-100'}`} />
            </button>

            <div className={`
                ${burgerMenu ? 'flex' : 'hidden'}
                shadow-[0px_4px_6px_#0f131a99,0px_2px_22px_#FFFFF0f]
                bg-[#1b1f24] dark:bg-[#1b1f24]
                text-[#f5f5f5 dark:text-[#f5f5f5
                border-[#292C33] dark:border-[#292C33]
                absolute -right-2 top-12 origin-bottom-right flex-col rounded-2xl border bg-alt shadow-bellowMedium `}>
                <div className=' flex flex-col justify-between z-20 items-center space-y-1px p-[7px]'>
                    {list.map((type: string) => (
                        <Link key={type}
                            href={`/${type}`}
                            onClick={() => setBurgerMenu(false)}
                            className='whitespace-nowrap rounded flex h-8 w-full items-center p-2 hover:bg-[#292c33] dark:hover:bg-[#292c33]'>
                            {upperFirstLetter(type)}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
