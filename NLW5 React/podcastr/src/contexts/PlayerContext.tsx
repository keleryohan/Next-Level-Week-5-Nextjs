import { createContext, ReactNode, useContext, useState } from 'react';

type PlayerContextData = { 
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    playMusic: (episode:Episode) => void; 
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state:boolean) => void;
    playList: (list:Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
}

type Episode = {
    title: string
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

export const PlayerContext = createContext({} as PlayerContextData);
//esse contexto pode ser qualquer coisa, string, objeto..
//embora esse valor padrão só sirva pra definir o formato do contexto

type PlayerContextProviderProps = {
    //ReactNode é uma tipagem para o props.children que basicamente 
    //significa 'qualquer coisa' que pode estar dentro de um 
    //componente react
    children: ReactNode;
}
//pegando a propriedade children de props (props.children)
export function PlayerContextProvider({children}: PlayerContextProviderProps){
    //é necessário utilizar o useState para variáveis de context
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const[isPlaying, setIsPlaying] = useState(false);
    const[isLooping, setIsLooping] = useState(false);
    const[isShuffling, setIsShuffling] = useState(false);

    function playMusic(episode:Episode){
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function togglePlay(){
        setIsPlaying(!isPlaying);
    }
    function toggleLoop(){
        setIsLooping(!isLooping);
    }
    function toggleShuffle(){
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean){
        setIsPlaying(state);
    }

    function playList(episodeList: Episode[], index: number){
        setEpisodeList(episodeList);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex -1 >= 0;
    const hasNext = isShuffling || currentEpisodeIndex +1 <= episodeList.length;

    function playNext(){
        if(isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }
        else if(!hasNext)
            return
        else
            setCurrentEpisodeIndex(currentEpisodeIndex +1); 
    }
    function playPrevious(){
        if(!hasPrevious){
            return
        }
        setCurrentEpisodeIndex(currentEpisodeIndex -1); 
    }

    return(
    //inicializando o valor do PlayerContext
    <PlayerContext.Provider value=
    {{episodeList, currentEpisodeIndex, isPlaying,
        hasPrevious, hasNext, isLooping, isShuffling,
        playMusic, togglePlay, setPlayingState, playList, clearPlayerState,
        playPrevious, playNext, toggleLoop, toggleShuffle}}>

        {children}
    </PlayerContext.Provider>
    )
}

//exportando o useContext com o playercontext, pra n precisar importar o useContext tda vez
//só utilizado no episodes/[slug].tsx, nos outros tá normal
export const usePlayer = () => {
    return useContext(PlayerContext)
}