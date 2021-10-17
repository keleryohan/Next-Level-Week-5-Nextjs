import {useRouter} from 'next/router'
import {GetStaticProps} from 'next';
import {GetStaticPaths} from 'next';
import { api } from '../../services/api';
import {format,parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episodes.module.scss'
import Image from 'next/image';
import Link from 'next/link'
import { useContext } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/PlayerContext';
import { Player } from '../../components/Player';
import Head from 'next/head';
type EpisodeProps = {
    episode: Episode
  }
  
  type Episode = {
      id: string,
      title: string,
      members: string,
      thumbnail: string,
      description: string,
      duration: number,
      durationAsString: string,
      url: string,
      publishedAt: string
  }

export default function Episode({episode} : EpisodeProps){
    const router = useRouter();

    //const {playMusic} = useContext(PlayerContext); //faz a mesma coisa v , só que com uma função definida em PlayerContext
    const {playMusic} = usePlayer();

    //se n tiver carregado ainda, retorne 'Carregando'
    if(router.isFallback){
        return(
            <p>Carregando</p>
        )
    }
    //obs: onde coloquei 'slug' no param pode ser o nome do parâmetro, como tá no nome do arquivo
    return(
        //<h1>{router.query.slug} </h1>
        <div className={styles.episode}>
            <Head>
                <title>NLW5 React - Finalizado 13/05</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href='/'>
                    <button type='button'>
                        <img  src='/arrow-left.svg' alt='voltar' />
                    </button>
                </Link>

                <Image width={700} 
                height={160} 
                src={episode.thumbnail} 
                objectFit='cover' />

                <button type='button' onClick={() => playMusic(episode)} >
                    <img  src='/play.svg' alt='play' />
                </button>

                </div>

                

                <header>
                    <h1>{episode.title} </h1>
                    <span>{episode.members} </span>
                    <span>{episode.publishedAt} </span>
                    <span>{episode.durationAsString} </span>
                </header>

                
                <div className={styles.description} 
                dangerouslySetInnerHTML={{__html: episode.description}} />


            
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    //pegando os dois últimos episódios para que sejam gerados antes
    const {data} = await api.get('episodes', {
        params: {
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc'
        }
      })

      const paths = data.map(episode => {
          return(
              {
                  params: {
                      slug: episode.id
                  }
              }
          )
      })
    return{
        //em paths se envia a lista de quais episódios(nesse caso) devem  
        //ser geradas no momento da build nesse caso slug(nome do parâmetro) 
        //os demais episódios são gerados quando o usuário tentar acessar(eu acho)
        paths: paths//lista com os objetos com os paths
        //paths: [...paths] //funciona tb
        , 
        fallback: 'blocking' //só exibe o conteúdo quando for carreado
                             //recomendado
    }
}


export const getStaticProps: GetStaticProps = async (context) => {
    const {slug} = context.params;
    const {data} = await api.get(`/episodes/${slug}`)

    const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url
    }

    return { 
        props: {
            episode: episode
        },
        revalidate: 60 * 60 * 24 //24h
    }
}