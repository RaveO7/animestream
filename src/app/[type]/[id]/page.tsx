"use client"

import React, { useState, useEffect } from 'react'
import PageListVideo from '@/components/PageListVideo'

export default function Page({ params, searchParams, }: {
    params: { type: string; id: string; }
    searchParams: { page: number }
}) {
    const tableau = ["anime", "studio", "genre"]
    const [valueMenu, setValueMenu] = useState("Latest");
    const type = tableau.includes(params.type) ? params.type : "anime"
    const name = decodeURI(params.id).toString()
    const pageNbr: number = searchParams.page && !isNaN(searchParams.page) ? Math.abs(searchParams.page) : 1

    const [videos, setDatasVideos] = useState([]) //Tableaux contenant toutes les vidéos
    const [nbrPage, setNbrPage] = useState(0) //Nombre de pages 1 page contient X vidéos
    const [nbrVideos, setNbrVideos] = useState(0) //Nombre de vidéos totale par rapport à la recherche
    const [loading, setLoading] = useState(true) //Affiche Loading le temps de la promesse du fetch()

    useEffect(() => {
        async function getSelectedShoes() {
            try {
                setLoading(true)
                const apiUrlEndpoint = "/api/typeVideos"

                const postData = {
                    method: "POST",
                    header: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: type,
                        name: name,
                        pageNbr: pageNbr,
                        order: valueMenu,
                    })
                }

                const response = await fetch(apiUrlEndpoint, postData)
                const res = await response.json()

                setNbrPage(res[0].page)
                setNbrVideos(res[0].nbr)
                setDatasVideos(res)
                setLoading(false)
            }
            catch {
                setLoading(false)
                return;
            }
        }
        getSelectedShoes();

    }, [type, name, pageNbr, valueMenu])

    return (
        <PageListVideo
            valueMenu={valueMenu}
            setValueMenu={setValueMenu}
            videos={videos}
            page={pageNbr}
            numberPage={nbrPage}
            type={name}
            nbrVideo={nbrVideos}
            loading={loading}
        />
    )
}