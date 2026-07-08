"use client";

import React, { useState } from 'react';
import Link from 'next/link'
import { Modal } from './Modal';
import { DroptownMenu } from './DroptownMenu';
import BurgerMenu from './BurgerMenu';
import { Separateur } from './Separateur'
import { IoSearch } from "react-icons/io5";

export default function Header() {
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const [search, setSearch] = useState('');
    const [valueMenu, setValueMenu] = useState("animes");

    function searchStart() { openSearchBar ? setOpenSearchBar(false) : setOpenSearchBar(true) }

    return (
        <header className='w-full z-50 bg-midnight px-4 md:px-8 lg:px-12 py-4 fixed'>
            <nav className="flex flex-row items-center justify-between m-auto w-full gap-5">

                <div className='flex gap-2'>
                    <Link href="/" className="flex items-center gap-2w-fit minsm:text-4xl text-2xl lg:text-2xl md:text-xl min-w-[155px] lg:min-w-[186px]">
                        <h1>Anime<span className='text-violet-400'>Stream</span></h1>
                    </Link>
                </div>

                <div className='hidden md:flex'>
                    <div className='flex gap-4 items-center flex-1 max-w-[530px]'>
                        <div className='bg-gray-700 flex items-center justify-center max-w-[340px] rounded-full hover:bg-gray-600 hover:cursor-pointer' onClick={searchStart}>
                            <div className='hidden md:block md:w-[220px] lg:w-[340px]'>
                                <div className='flex h-10 flex-row items-center space-x-2 px-3'>
                                    <IoSearch id="b" className="w-5 h-5 text-white" />

                                    <div className="text-[14px] font-[600] leading-[18px] tracking-[0.1px] flex-grow text-alt2">{!search ? "Rechercher " + valueMenu + " ..." : search} </div>

                                    <div className="text-[14px] font-[400] leading-[20px] tracking-[0] text-alt2">Ctrl+K</div>
                                </div>
                            </div>

                        </div>
                        dans
                        <DroptownMenu valueMenu={valueMenu} setValueMenu={setValueMenu} />
                    </div>
                </div>

                <div className='hd:min-w-[210px] flex justify-end items-center gap-2 relative'>
                    <IoSearch className="md:hidden block hover:cursor-pointer hover:text-white w-6 h-6 md:w-5 md:h-5 text-gray-300 mr-1" onClick={searchStart} />

                    <div className='md:inline hidden'><Separateur height={7}/></div>

                    <BurgerMenu />
                </div>
                <Modal search={search} setOpenSearchBar={setOpenSearchBar} setSearch={setSearch} openSearchBar={openSearchBar} valueMenu={valueMenu} setValueMenu={setValueMenu} />
            </nav>
        </header >
    )
}
