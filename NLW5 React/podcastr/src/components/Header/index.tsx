import styles from './styles.module.scss';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR'

export function Header(){
    //pegando data atual padrão JS
    //const currentDate = new Date().toLocaleDateString();

    //pegando data atual usando o date-fns
    const currentDate = format(new Date(),'EEEEEE, d MMMM',{
        locale: ptBR,
    });


    return(
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="logo podcaster"/>
            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    );
}