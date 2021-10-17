import '../styles/global.scss';
import styles from '../styles/app.module.scss';

import {Header} from '../components/Header';
import { Player } from '../components/Player';



//quem eu quero que tenha acesso as informações do Player context
//tem que ficar 'cercadas' pelo componente do PlayerContext
import {PlayerContext, PlayerContextProvider} from '../contexts/PlayerContext'
import { useEffect, useState } from 'react';

//todos os componentes são chamados dentro do _app

function MyApp({ Component, pageProps }) {
  //transferido para o próprio PlayerContext
  /*
  //é necessário utilizar o useState para variáveis de context
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const[isPlaying, setIsPlaying] = useState(false);

  
  function playMusic(episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }
  */

  return (
    //transferido para o próprio PlayerContext
    //inicializando o valor do PlayerContext
    //<PlayerContext.Provider value={ {episodeList, currentEpisodeIndex, isPlaying, playMusic, togglePlay, setPlayingState} }>
    <PlayerContextProvider>
    <div className={styles.wrapper}>
      <main>
        <Header/>
        <Component {...pageProps} />
      </main>
      <Player/> 
    </div>
    </PlayerContextProvider>
  )
}

export default MyApp
