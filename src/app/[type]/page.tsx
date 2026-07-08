"use client"

import React, { useState, useEffect } from 'react'
import PageListVideo from '@/components/PageListVideo'

export default function Test({ params, searchParams, }: { params: { type: string; }, searchParams: { page: number } }) {
    const tableau = ["studios", "animes", "genres"]
    const type = tableau.includes(params.type) ? params.type : tableau[0]
    const pageNbr: number = searchParams.page && !isNaN(searchParams.page) ? Math.abs(searchParams.page) : 1

    const [valueMenu, setValueMenu] = useState("A->Z");
    const [videos, setDatasVideos] = useState([])
    const [nbrPage, setNbrPage] = useState(0)
    const [nbrVideos, setNbrVideos] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getSelectTypes() {
            try {
                setLoading(true)
                const apiUrlEndpoint = "/api/type"

                const postData: any = {
                    method: "POST",
                    header: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: type,
                        pageNbr: pageNbr,
                        order: valueMenu,
                    })
                }

                const response = await fetch(apiUrlEndpoint, postData)
                const res = await response.json()

                if (!res.length) return;

                // ✅ OPTIMISÉ : setState n'est pas async, retirer les await inutiles
                setDatasVideos(res)
                setNbrPage(res[0].nbrPages)
                setNbrVideos(res[0].nbrTt)
                setLoading(false)
            }
            catch {
                // ✅ OPTIMISÉ : setState n'est pas async, retirer les await inutiles
                setLoading(false)
                return;
            }
        }
        getSelectTypes();

    }, [type, pageNbr, valueMenu])

    return (
        <PageListVideo
            valueMenu={valueMenu}
            setValueMenu={setValueMenu}
            videos={videos}
            page={pageNbr}
            numberPage={nbrPage}
            type={type}
            nbrVideo={nbrVideos}
            loading={loading}
        />
    )
}