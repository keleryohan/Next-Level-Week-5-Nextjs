import Document, {Html, Head, Main, NextScript} from 'next/document';
//componente chamado apenas uma vez em toda a aplicação
//tem que ter esse nome de arquivo (_document)

//importando as fontes
//só precisa ser feito uma vez, então se faz neste documento


export default class MyDocument extends Document{
    render(){
        return(
            <Html>
                <Head>
                    
                    <link rel="preconnect" href="https://fonts.gstatic.com"/>
                    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet"/>
                    <link rel='shortcut icon' href='/favicon.png' type='image/png' />
                </Head>
                    <body>
                        <Main/>
                        <NextScript/>
                    </body>
            </Html>
        )
    }
}