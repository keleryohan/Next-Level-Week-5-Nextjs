//formas de acessar API
//Single Page Aplication(SPA)
//Server Side Rendering (SSR)
//Static Site Generation (SSG)
import styles from "./home.module.scss";

import Head from "next/head";
import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

//GetStaticProps(com G maiúsculo mesmo) define os parâmetros e o retorno da função getStaticProps
//obs: existe para GetServerSideProps tb
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";
type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

//export default function Home(props: HomeProps) { //funciona tb. props.latestEpisodes...
export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  //props.episodes[0];

  //SPA
  /*
  //useEffect faz algo sempre que certa coisa mudar na aplicação
  //executa a função sempre que alguma variável da lista mudar
  //se for uma lista vazia, executa apenas 1 vez ao carregar a pág
  useEffect(() => {
    fetch('http://localhost:3333/episodes').
    then(response => response.json()).
    then(data => console.log(data));
  },[])
  */

  /* Image do next usada para imagens exportadas de fontes externas e/ou imagens mais pesadas 
  normalmente o width/height é definido como 3x maior do que o que planejado ser usado*/

  const { playList } = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homePage}>
      <Head>
        <title>NLW5 React - Finalizado 13/05</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title} </a>
                  </Link>

                  <p>{episode.members}</p>
                  <span>{episode.publishedAt} </span>
                  <span> {episode.durationAsString} </span>
                </div>

                <button
                  type="button"
                  onClick={() => playList(episodeList, index)}
                >
                  <img src="/play-green.svg" alt="tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 100 }}>
                    {" "}
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      title={episode.title}
                      objectFit="cover"
                    />{" "}
                  </td>

                  <Link href={`episodes/${episode.id}`}>
                    <td>
                      {" "}
                      <a>{episode.title}</a>{" "}
                    </td>
                  </Link>

                  <td>{episode.members} </td>
                  <td style={{ width: 100 }}>{episode.publishedAt} </td>
                  <td>{episode.durationAsString} </td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        playList(episodeList, index + latestEpisodes.length)
                      }
                    >
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

//SSR
/*
//usa essa função do NEXT, que é chamada antes da página carregar
//o objeto props retornado por essa função pode ser acessado no
//componente react como um atributo: ...function Home(props)
//obs: só pode ser usado com o NEXT
export async function getServerSideProps(){
  const response = await fetch('http://localhost:3333/episodes')
    
  const data = await response.json();
  //sempre retorna os dados em um objeto 'props'
  return{
    props: {
      episodes: data
    }
  }
}
*/
//SSG
/*

//mesma ideia do SSR, mas só chama uma nova versão do backend 
//de tempo em tempo(definido no 'revalidate' em segundos)
//bom para perfomance, já que quando um usuário acessar os dados já
//devem estar carregados
export async function getStaticProps(){
  const response = await fetch('http://localhost:3333/episodes')
    
  const data = await response.json();
  //sempre retorna os dados em um objeto 'props'
  return{
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8 //em segundos, nesse caso 8 horas
  }
}
*/

//SSG mas usando tipagem (definindo parâmetros, retorno) da função getStaticProps
export const getStaticProps: GetStaticProps = async () => {
  //pegando os últimos 12 episódios,
  //ordenados por quando foram publicados (ordem decrescente)
  //usando o método nativo 'fetch'
  //const response = await fetch('http://localhost:3333/episodes?_limit=12&sort=published_at&_order=desc')

  const response = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  //const data = await response.json(); //versão com o fetch
  const data = response.data;

  //é bom fazer a formatação dos dados antes de retorna-los
  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.lenght);

  //sempre retorna os dados em um objeto 'props'
  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, //em segundos, nesse caso 8 horas
  };
};
