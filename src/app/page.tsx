"use client"

import React, { useState, useEffect } from 'react'
import PageListVideo from '../components/PageListVideo'
import { createPostRequest } from '@/lib/api-helpers'

export default function Home({ searchParams }: { searchParams: { page: number } }) {
  const [loading, setLoading] = useState(true)
  const [valueMenu, setValueMenu] = useState("Latest");
  const [nbrPage, setNbrPage] = useState(1)
  const [videos, setDatasVideos] = useState([])

  const pageNbr: number = searchParams.page && !isNaN(searchParams.page) ? Math.abs(searchParams.page) : 1

  useEffect(() => {
    async function getVideos() {
      try {
        setLoading(true)
        const apiUrlEndpoint = "/api/homeVideos"

        // ✅ OPTIMISÉ : Utilisation de la fonction utilitaire au lieu de postData: any
        const postData = createPostRequest({
          pageNbr: pageNbr,
          order: valueMenu,
        })
        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        // ✅ OPTIMISÉ : setState n'est pas async, retirer les await inutiles
        setNbrPage(res[0].nbr)
        setDatasVideos(res)
        setLoading(false)
      }
      catch {
        // ✅ OPTIMISÉ : setState n'est pas async, retirer les await inutiles
        setLoading(false)
        return;
      }
    }

    getVideos();

  }, [pageNbr, valueMenu])

  return (
    <PageListVideo
      valueMenu={valueMenu}
      setValueMenu={setValueMenu}
      videos={videos}
      page={pageNbr}
      numberPage={nbrPage}
      type={""}
      nbrVideo={0}
      loading={loading}
    />
  )
}
