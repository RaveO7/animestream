import React, { Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { DroptownMenu } from './DroptownMenu'
import { RxCross2 } from "react-icons/rx";
import { useRouter } from 'next/navigation';

interface Props {
    openSearchBar: boolean
    setOpenSearchBar: Dispatch<SetStateAction<boolean>>
    search: string
    setSearch: Dispatch<SetStateAction<string>>
    valueMenu: string
    setValueMenu: Dispatch<SetStateAction<string>>
}

export function Modal(props: Props) {
    // ✅ OPTIMISÉ : Destructuring en une ligne (au lieu de 6 lignes séparées)
    const { openSearchBar, setOpenSearchBar, search, setSearch, valueMenu, setValueMenu } = props
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // ✅ OPTIMISÉ : Fonction mémorisée avec useCallback pour éviter les re-créations
    const searchStart = useCallback(() => {
        setOpenSearchBar(prev => !prev)
    }, [setOpenSearchBar])

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        searchStart();
        setIsLoading(true)

        try {
            router.push("/search/" + valueMenu + "/" + search);
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // ✅ OPTIMISÉ : keyDownHandler mémorisé avec useCallback pour éviter les re-créations
    const keyDownHandler = useCallback((event: KeyboardEvent) => {
        if ((event.ctrlKey && event.key === "k") || (event.key === "Escape" && openSearchBar)) {
            event.preventDefault()
            searchStart()
        }
    }, [openSearchBar, searchStart]);

    const inputRef = useRef<HTMLInputElement>(null);
    const ref = useRef<HTMLFormElement>(null);

    // ✅ OPTIMISÉ : useEffect avec dépendances correctes (keyDownHandler est maintenant stable)
    useEffect(() => {
        window.addEventListener("keydown", keyDownHandler);
        if (openSearchBar && inputRef.current) {
            inputRef.current.focus();
        }
        document.documentElement.style.overflow = openSearchBar ? 'hidden' : 'auto';
        return () => { 
            window.removeEventListener("keydown", keyDownHandler); 
        };
    }, [keyDownHandler, openSearchBar]);

    // ✅ OPTIMISÉ : handleOutSideClick mémorisé et dépendances correctes
    useEffect(() => {
        const handleOutSideClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpenSearchBar(false)
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);
        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [setOpenSearchBar]);

    return (
        <div data-modal-backdrop="static" className={`${openSearchBar ? "flex" : "hidden"}
        fixed top-0 right-0 left-0 justify-center items-center md:inset-0 
        w-full h-full bg-bgBody/90 backdrop-blur-md z-50 overflow-hidden`} >
            <div className="p-4 md:p-0">
                <form ref={ref} onSubmit={onSubmit}
                    className='p-4 md:p-5 md:min-w-[650px] h-auto max-w-2xl w-full relative bg-gray-700 dark:bg-gray-700 rounded-lg shadow'>

                    <div className='flex justify-end mb-3 absolute right-1 top-1'>
                        <button type="button" onClick={searchStart}
                            className="
                        w-8 h-8 text-sm rounded-lg
                        inline-flex justify-center items-center
                        text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" >
                            <RxCross2 className="w-6 h-6" />

                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className='w-full flex items-center justify-between mt-8 mb-10 gap-3 '>

                        <div className='flex flex-row-reverse flex-1 gap-1'>
                            <input id="a" name='title' ref={inputRef} onChange={(e) => setSearch(e.target.value)} value={search} placeholder={"Search " + valueMenu + " ..."} type='text' dir="auto"
                                className=" w-full border-b text-lg  font-[700] leading-[23px] tracking-[0px] text 
                                placeholder:text-alt3 bg-transparent focus-visible:outline-none focus-visible:border-violet-500 dark:focus-visible:border-violet-500" />

                            <IoSearch id="b" className="w-6 h-6 text-white" />
                        </div>

                        <DroptownMenu valueMenu={valueMenu} setValueMenu={setValueMenu} />

                    </div>

                    <button
                        type="submit"
                        name='submit'
                        className="w-[95%] text block m-auto
                        focus:ring-4 focus:outline-none font-medium rounded-lg text-sm-center 
                        text-white bg-violet-600 hover:bg-violet-700 focus:ring-violet-300
                        dark:text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800">
                        <p className='w-full py-3 hover:cursor-pointer'>Valider</p>
                    </button>

                </form>
            </div>
        </div>
    )
}