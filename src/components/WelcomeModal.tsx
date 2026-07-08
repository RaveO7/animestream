'use client'
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from './Utils';

const WelcomeModal = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => { if (!getCookie('welcomeSeen')) { setShowWelcome(true); } }, []);

  const handleEnter = () => {
    setShowWelcome(false);
    setCookie('welcomeSeen', 'true', 7, '/')
  };

  return (
    showWelcome && (
      <div data-modal-backdrop="static" aria-hidden="true" className={`
      fixed top-0 right-0 left-0 bottom-0 justify-center items-center md:inset-0 
      w-full h-full bg-bgBody/90 backdrop-blur-md z-[100] overflow-hidden`} >
        <div className="p-4 md:p-0 h-screen m-auto flex justify-center items-center">
          <div
            className='p-4 md:p-5 md:min-w-[650px] h-auto max-w-2xl w-full relative bg-gray-700 dark:bg-gray-700 rounded-lg shadow'>
            <div className='w-full flex flex-col items-center justify-between mb-4 gap-3'>
              <h2 className='text-4xl md:text-6xl'>Anime<span className='text-violet-400'>Stream</span></h2>
              <h3 className='text-xl md:text-2xl'>Bienvenue !</h3>
              <h3 className='max-w-[80%] text-center'>
                Découvrez votre plateforme de streaming d&apos;animés en HD.
                Profitez d&apos;épisodes, de studios et de genres variés.
              </h3>
            </div>
            <button type="button"
              name='Welcome button'
              onClick={handleEnter}
              className="w-[95%] text block m-auto text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm-center bg-violet-600 hover:bg-violet-700 focus:ring-violet-800 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800">
              <input type='submit' name='submit' value="Entrer sur le site" className='w-full py-3 hover:cursor-pointer' />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default WelcomeModal;
