"use client"

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { upperFirstLetter } from './Utils';
import { IoCaretDownSharp, IoCaretUpSharp } from 'react-icons/io5'
interface Props {
    video: Array<string>
    setPlayer: Dispatch<SetStateAction<number>>
}

export default function DropDown(props: Props) {
    const [burgerMenu, setBurgerMenu] = useState(false);
    const [valueMenu, setValueMenu] = useState('stream n°1');

    const setPlayer = props.setPlayer
    const video = props.video

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
    function burgerMenuClick(e: React.MouseEvent<HTMLParagraphElement>) {
        const target = e.target as HTMLElement;
        setValueMenu(target.innerText.toLowerCase())
        setPlayer(parseInt(target.innerText.replace(/\D/g, '')) - 1)
        setBurgerMenu(false)
    }

    function createStreamArray(size: number) {
        const streamArray = [];
        for (let i = 1; i <= size; i++) { streamArray.push(`stream n°${i}`); }
        return streamArray;
    }

    let list = createStreamArray(video.length);
    list = list.filter(list => list !== valueMenu);

    return (
        <div ref={ref} className='relative flex flex-col z-10 w-fit mb-4'>
            <button type="button" className="
            relative flex items-center justify-center h-10 w-full p-2 min-w-[110px] gap-3 rounded-xl
            bg-gray-700 dark:bg-gray-700
            hover:bg-gray-600  dark:hover:bg-gray-600
            border-transparent border-2 hover:border-white dark:hover:border-white"
                onClick={() => setBurgerMenu((val) => !val)}>
                {upperFirstLetter(valueMenu)}
                {burgerMenu ? (<IoCaretUpSharp />) : (<IoCaretDownSharp />)}
            </button>

            {burgerMenu && (
                <div className="min-w-full mt-[2px] absolute  top-[42px] flex origin-bottom-right flex-col rounded-2xl
                shadow-[0px_4px_6px_#0f131a99,0px_2px_22px_#FFFFF0f]
                bg-[#1b1f24] dark:bg-[#1b1f24] text-[#f5f5f5] dark:text-[#f5f5f5] border-x-2 border-y-[1px] border-[#292C33] dark:border-[#292C33]">
                    <div className=' flex flex-col justify-between items-center space-y-1px p-[7px]'>
                        {list.map((name, id) => (
                            <p key={id} onClick={(e) => burgerMenuClick(e)} className='whitespace-nowrap rounded-xl flex h-8 w-full items-center p-2 hover:bg-[#292c33] dark:hover:bg-[#292c33] hover:cursor-pointer'>
                                {upperFirstLetter(name)}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}