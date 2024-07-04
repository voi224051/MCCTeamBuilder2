import {useState, useEffect, createContext} from 'react'
import './App.css';
import PlayerDiv from './PlayerDiv';
import TemplateDiv from './TemplateDiv';

export const PlayersContext = createContext();

const Footer = () => {
    const [id, setId] = useState(0);
    const credits = [
        <div>Shout out to <a href='https://www.reddit.com/user/UnknownI_IWalker'>u/UnknownI_IWalker</a> for the nice templates :D </div>,
        <div>It's the <a href='https://noxcrew.com/'>Noxcrew</a> that made this amzing event!</div>,
        <div>Thank you <a href='https://www.mcc.tips'>MCC Tips</a>, I stole quite a bit images from your database before I turn to use youtube icons directly :)</div>,
        <div>Try to find easter eggs!</div>,
    ];

    useEffect(() => {
        const timer = () => {
            if (id === 10 * 4) setId(0)
            else setId(id + 1)
        }

        let interval = setInterval(() => {
            timer();
        }, 1000);

        return () => clearInterval(interval);
    }, [id]);

    return (
        <div className='footer'>
            {credits[Math.floor(id / 10)]}
        </div>
    )
}

const App = () => {
    const initialSlotData = (idx) => {return {
        id: idx,
        name: '',
        src: '',
    }}
    const [players, setPlayers] = useState([initialSlotData(0), initialSlotData(1), initialSlotData(2), initialSlotData(3)]);

    return (
        <PlayersContext.Provider value={{players: players, setPlayers: setPlayers}}>
            <div className="App">
                <div className='header'>
                    <h1>MCC Team Builder</h1>
                </div>

                <PlayerDiv />
                <TemplateDiv />

                <Footer />
            </div>
        </PlayersContext.Provider>
    );
}

export default App;
