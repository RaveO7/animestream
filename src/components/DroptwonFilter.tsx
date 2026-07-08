"use client"

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { IoCaretDownSharp, IoCaretUpSharp } from 'react-icons/io5'
import Link from 'next/link';

interface Props {
    valueMenu: string
    setValueMenu: Dispatch<SetStateAction<string>>
    list: Array<string>
}

export default function BurgerMenuIndexPage(props: Props) {
    const [burgerMenu, setBurgerMenu] = useState(false);

    const valueMenu = props.valueMenu
    const setValueMenu = props.setValueMenu

    // ✅ OPTIMISÉ : Type explicite pour la ref
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // ✅ OPTIMISÉ : Type MouseEvent au lieu de any
        const handleOutSideClick = (event: MouseEvent) => {
            // ✅ OPTIMISÉ : Type explicite et vérification null
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setBurgerMenu(false)
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, []); // ✅ OPTIMISÉ : ref est stable, pas besoin dans les dépendances

    // ✅ OPTIMISÉ : Type React.MouseEvent au lieu de any
    function burgerMenuClick(e: React.MouseEvent<HTMLAnchorElement>) {
        const target = e.target as HTMLElement;
        setValueMenu(target.innerText)
        setBurgerMenu(false)
    }

    const list = props.list.filter(list => list !== valueMenu);

    return (
        <div ref={ref} className='relative flex flex-col z-10 w-fit'>
            <button type="button" className="relative flex items-center justify-center h-10 w-full p-2 min-w-[110px] gap-3 rounded-xl hover:bg-gray-600 bg-gray-700 border-transparent border-2 hover:border-white"
                aria-label={'Button Open Burger Menu Choice Order Videos Actual Order Choice Is' + valueMenu}
                onClick={() => setBurgerMenu((val) => !val)}>
                <h3 className='text-sm md:text-xl'>{valueMenu}</h3>
                {burgerMenu ? (<IoCaretUpSharp />) : (<IoCaretDownSharp className="" />)}
            </button>

            {burgerMenu && (
                <div className="min-w-full
                absolute -right-1 top-12 flex origin-bottom-right flex-col rounded-2xl
                shadow-[0px_4px_6px_#0f131a99,0px_2px_22px_#FFFFF0f] bg-[#1b1f24] text-[#f5f5f5] border-x-2 border-y-[1px] border-[#292C33]">
                    <div className=' flex flex-col justify-between items-center space-y-1px p-[7px]'>
                        {list.map((name, id) => (
                            <Link key={id} aria-label={'Order By ' + { name }} role='link' onClick={(e) => burgerMenuClick(e)} href={""} className='whitespace-nowrap rounded flex h-8 w-full items-center p-2 hover:bg-[#292c33]'>{name}</Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}