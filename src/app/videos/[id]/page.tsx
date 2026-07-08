"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link';

import { Separateur, SeparateurLigne } from '@/components/Separateur'
import TimeDifference, { deleteCookie, formatString, getCookie, getRating, setCookie, upperFirstLetter } from '@/components/Utils';
import DropDown from '@/components/DroptownMenuEpurate';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import { IoMdThumbsUp, IoMdThumbsDown } from "react-icons/io";
import { FaFlag } from "react-icons/fa";
import Galery from '@/components/Galery';

export default function Videos({ params }: { params: { id: number } }) {
  const [dataVideo, setDataVideo] = useState([] as any)
  const [dataMoreVideo, setDataMoreVideo] = useState([])
  const [dataNbrVideo, setDataNbrVideo] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [player, setPlayer] = useState(0);
  const [cookieLike, setCookieLike] = useState<any>('');
  const [repport, setRepport] = useState<any>('false');

  const id = params.id
  useEffect(() => {
    const getSelectedVideo = async () => {
      try {
        setLoading(true)
        const apiUrlEndpoint = "/api/video"

        const postData: any = {
          method: "POST",
          header: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id
          })
        }
        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        setDataNbrVideo(res[0])
        setDataVideo(res[1])
        setDataMoreVideo(res[2])
        setLoading(false)
      }
      catch {
        setLoading(false)
        return;
      }
    }

    async function getAddOneView() {
      try {
        const apiUrlEndpoint = "/api/addViewVideo"

        const postData: any = {
          method: "POST",
          header: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id
          })
        }
        await fetch(apiUrlEndpoint, postData)
      }
      catch { return; }
    }

    getSelectedVideo();

    if (!getCookie(id)) { setCookie(id, 'true', 7, '/'); getAddOneView(); }

  }, [])

  useEffect(() => {
    if (getCookie(id + 'like')) {
      setCookieLike(getCookie(id + 'like'))
    }
    if (getCookie(id + 'repport')) {
      setRepport(getCookie(id + 'repport'))
    }
  }, [cookieLike, repport])

  if (isLoading) return <Loading />
  if (!dataVideo) return <Nodata />

  const title: string = dataVideo.title;
  const videos: Array<string> = modifierLiens(dataVideo.videoUrl.split(','));
  const channel: string = dataVideo.channels.replace(/,.*$/, '')
  const acteurs: Array<string> = dataVideo.actors.split(',');
  const tags: Array<string> = dataVideo.categories.split(',');

  const like: number = dataVideo.like
  let dislike: number = dataVideo.dislike
  const nbrView: number = dataVideo.view
  let date: string = dataVideo.createdAt
  date = TimeDifference({ date })
  const rating: number = getRating(like, dislike)

  function modifierLiens(liens: Array<string>) {
    // Parcourir le tableau
    for (let i = 0; i < liens.length; i++) {
      // Vérifier si l'élément commence par "https://streamtape.com/v/"
      if (liens[i].startsWith("https://streamtape")) {

        // Remplacer "/v/" par "/e/"
        liens[i] = liens[i].replace("/v/", "/e/");
      }
    }

    // Retourner les liens mis à jour
    return liens;
  }

  function setUpdate(val: string) {
    switch (val) {
      case 'l':
        if (!getCookie(id + 'like') || getCookie(id + 'like') !== 'true') {
          setCookieLike('true')
          setCookie(id + 'like', 'true', 31, '/videos/' + id);
          addValVideoData(val);
        } else {
          setCookieLike('')
          deleteCookie(id + 'like', '/videos/' + id)
        }
        break;
      case 'd':
        if (!getCookie(id + 'like') || getCookie(id + 'like') !== 'false') {
          setCookieLike('false')
          setCookie(id + 'like', 'false', 31, '/videos/' + id);
          addValVideoData(val);
        } else {
          setCookieLike('')
          deleteCookie(id + 'like', '/videos/' + id)
        }
        break;
      case 'r':
        if (!getCookie(id + 'repport')) {
          setRepport('true')
          setCookie(id + 'repport', 'true', 31, '/videos/' + id);
          addValVideoData(val);
        } else {
          setRepport('')
          deleteCookie(id + 'repport', '/videos/' + id)
        }
        break;
    }
  }

  async function addValVideoData(value: any) {
    try {
      const apiUrlEndpoint = "/api/addValVideoData"
      const postData: any = {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          cookie: value,
        }),
      };
      await fetch(apiUrlEndpoint, postData)
    }
    catch {
      setLoading(false)
      return;
    }
  }

  return (
    <div className='w-full flex flex-col'>
      {videos[1] && <DropDown video={modifierLiens(videos)} setPlayer={setPlayer} />}
      <div className='flex w-full mb-2'>
        <div className=' border-[1px] border-blue-300 md:w-[75%] aspect-w-16 aspect-h-9 md:aspect-h-7 w-full h-full bg-gray-950'>
          <iframe id="monIframe" className='w-full h-full'
            title={'Video ' + title}
            allowFullScreen allow="autoplay" scrolling="no" frameBorder="0"
            src={videos[player]}
          >
          </iframe>
        </div>
      </div>

      <div className='flex'>
        <div className='w-[100%] md:w-[75%] h-full p-2'>
          <div>
            <h2 className="max-w-full mb-2 text-xl">{upperFirstLetter(title)}</h2>
            <div className='flex flex-col mm:flex-row items-center justify-between text-sm text-infoVideo'>
              <div className='flex items-center '>
                <p>{nbrView} Vues</p>

                <Separateur height={7}/>

                <div className='flex items-center'><IoMdThumbsUp className="mr-1" /> {Math.ceil(rating)} %</div>

                <Separateur height={7}/>

                <div>Il y a {date}</div>

              </div>

              <div className='flex items-center gap-1 text-xl'>
                <button role="button" name="like" aria-label={'Button Add Like Number Like ' + like} className=
                  {`${cookieLike == 'true' ? "text-blue-500" : "hover:text-blue-500"} flex items-center duration-300`}
                  onClick={() => setUpdate('l')}>
                  <IoMdThumbsUp className="mr-1" />{cookieLike == 'true' ? like + 1 : like}</button>
                <Separateur height={7}/>
                <button role="button" name="dislike" aria-label={'Button Add Dislike Number Like' + dislike} className=
                  {`${cookieLike == 'false' ? "text-red-500" : "hover:text-red-500"} flex items-center duration-300`}
                  onClick={() => setUpdate('d')}>
                  <IoMdThumbsDown className="mr-1" />{cookieLike == 'false' ? dislike + 1 : dislike}</button>
                <Separateur height={7}/>
                <button role="button" name="repport" aria-label='Repport Video' className=
                  {`${repport == 'true' ? "text-red-700" : "hover:text-red-700"} flex items-center duration-300`}
                  onClick={() => setUpdate('r')}> <FaFlag className="mr-2" /> <span className='block mm:hidden md:block'>Repport</span>
                </button>
              </div>
            </div>

            <SeparateurLigne />

            <div className='w-full flex flex-col'>
              <div className='flex justify-start'>

                {channel.length > 0 &&
                  <Link href={'/studio/' + channel} className=' hover:text-violet-400 px-2 mx-2 flex flex-col justify-center items-center hover:bg-bgTimeVideo hover:cursor-pointer rounded-xl'>
                    <h3 className='text-[25px] text-center'>{formatString(channel)}</h3>
                    <p className='text-dessous text-xs mb-[5px] mt-2'>{dataNbrVideo} Épisodes</p>
                  </Link>
                }

                <div className='flex-1 w-full max-h-[107px] overflow-hidden '>
                  {acteurs[0].length !== 0 &&
                    <>
                      <p className='text-dessous text-[15px] mb-[5px]'>Personnages</p>

                      {acteurs.map((actor, id) => (
                        actor && <Link href={'/character/' + actor} key={id} className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-sm py-2 px-[18px] mr-1 inline-block  mb-1'>
                          {formatString(actor)}
                        </Link>
                      ))}
                    </>
                  }
                  {(acteurs[0].length == 0 && tags[0].length > 0) &&
                    <>
                      <p className='text-dessous text-[15px] mb-[5px]'>Genres</p>
                      {tags.map((categorie: string, id: React.Key) => (
                        categorie && <Link href={'/genre/' + categorie} key={id} className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-sm py-2 px-[18px] mr-1 inline-block  mb-1'>
                          {formatString(categorie)}
                        </Link>
                      ))}
                    </>
                  }
                </div>
              </div>

              {(acteurs[0].length !== 0 && tags[0].length > 0) &&
                <>
                  <div className='w-full border-b-2 opacity-10 border-red-50 my-3'></div>
                  <div>
                    <p className='text-dessous text-[15px] mb-[5px]'>Genres</p>
                    {tags.map((categorie: string, id: React.Key) => (
                      categorie && <Link href={'/genre/' + categorie} key={id} className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-sm py-2 px-[18px] mr-1 inline-block  mb-1'>
                        {formatString(categorie)}
                      </Link>
                    ))}
                  </div>
                </>
              }
            </div>

            <SeparateurLigne />

            <section className="w-full flex flex-wrap mb-3">
              <Galery images={dataMoreVideo.slice(0, 8)} type='' />
            </section>
          </div>
        </div>
      </div>
    </div >
  )
}
