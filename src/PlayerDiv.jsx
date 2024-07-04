import axios from 'axios';
import {useEffect, useState, useContext} from 'react'
import { PlayersContext } from "./App"
import "./PlayerDiv.css"

const PlayerTable = ({ players }) => {
    const playersOnSlot = useContext(PlayersContext).players;
    const setPlayersOnSlot = useContext(PlayersContext).setPlayers;

    const onDragStart = (e, p) => {
        e.dataTransfer.setData("start-point", 'table')
        e.dataTransfer.setData("drag-player", `{ "name": "${p.name}", "src": "${p.icon}" }`);
    }

    const onDragOver = (e) => {e.preventDefault()};
    const onDrop = (e) => {
        const startingPoint = e.dataTransfer.getData('start-point');
        if (startingPoint !== 'table') {
            const spIdx = parseInt(startingPoint);
            setPlayersOnSlot(
                playersOnSlot.slice(0, spIdx)
                .concat([{
                    id: spIdx,
                    name: '',
                    src: '',
                }])
                .concat(playersOnSlot.slice(spIdx+1))
            );
        }
    }

    if (players.length === 0) {
        return (
            <div className='playerTableContainer'>
                <p>Can't find such player :(</p> <br />
                <p>If you think it's a mistake, please give us some time,</p>
                <p>we'll improve our searching function in the future!</p>
            </div>
        )
    }

    if (players.length <= 4) {
        return (
            <div className='playerTableContainer'>
            <div className='playerTable' key='playerTable'>
                {players.map(p => 
                <img src={p.icon} alt={p.name} key={`playerImg${p.id}`} className='playerImg' 
                    onDragStart={(e)=>{onDragStart(e,p)}} onDragOver={onDragOver} onDrop={onDrop} />
                )}
            </div>
            <p>That's all we can find :)</p>
        </div>
        )
    }

    return (
        <div className='playerTableContainer'>
            <div className='playerTable' key='playerTable'>
                {players.map(p => 
                <img src={p.icon} alt={p.name} key={`playerImg${p.id}`} className='playerImg' 
                    onDragStart={(e)=>{onDragStart(e,p)}} onDragOver={onDragOver} onDrop={onDrop} />
                )}
            </div>
        </div>
    )
}

const PlayerDiv = () => {
    const [query, setQuery] = useState('');
    const [showRecent, setShowRecent] = useState(false);
    const [players, setPlayers] = useState([]);
    const [recentPlayers, setRecentPlayers] = useState([]);

    useEffect(()=>{
        console.log('Fetching players data...');
        axios
            .get('https://voikiddo-teambuilder-db.glitch.me/players')
            .then(res =>{
                setPlayers(res.data);
            })

        console.log('Fetching recent players...');
        axios
            .get('https://voikiddo-teambuilder-db.glitch.me/recent')
            .then(res => {
                setRecentPlayers(res.data);
            })
    }, [])

    const onChangeQuery = e => { 
        switch(e.target.value.toLowerCase()) {
            case "scott": e.target.value = "(Try Smajor!)"; break;
            case "goodtimeswithscar": e.target.value = "(Try GoodTimeWithScar!)"; break;
            case "cpk": e.target.value = "(Try Seapeekay!)"; break;
            case "niki": e.target.value = "(Try Nihachu!)"; break;
            case "phil": e.target.value = "(Try Ph1LzA!)"; break;
            case "philza": e.target.value = "(Try Ph1LzA!)"; break;
            case "martyn": e.target.value =  "(Try InTheLittleWood!)"; break;
            case "mcc": e.target.value = "(widepeepoHappy)"; break;
            case "noxcrew": e.target.value = "(Thank you Noxcrew for the MCC :D )"; break;
            case "theultrasheeplord": e.target.value = "(Thank you for the spreadsheet & database! :D )"; break;
            case "mcc tips": e.target.value = "(Thank you for the spreadsheet & database! :D )"; break;
            case "unknowni_iwalker": e.target.value = "(Thank you for the templates! :D )"; break;
            case "streamers": e.target.value = "(I was watching those people's stream while having a mental breakdown: HammSamich & CarterCxter)"; break;
            case "voik": e.target.value = "(You caught me! Wanna know what am I doing?)"; break;
            case "yes": e.target.value = "(hehehe I'm not telling you)"; break;
            case "what": e.target.value = "(hehehe I'm not telling you)"; break;
            case "tell me": e.target.value = "(No)"; break;
            case "please": e.target.value = "(No)"; break;
            case "stop saying no": e.target.value = "(Okay.)"; break;
            case "wtf": e.target.value = "( D: )"; break;
            case "d:": e.target.value = "(Hey that's my line!)"; break;
            case "fuck": e.target.value = "(NO SWEARING! Oops sorry for caps.)"; break;
            default: break;
        }

        setQuery(e.target.value.toLowerCase());
    }

    const playerFilter = p => {
        if (p.name.toLowerCase().includes(query)) {
            if (showRecent) {
                return (recentPlayers.some(rp => {
                    const a = rp.toLowerCase();
                    const b = p.name.toLowerCase();
                    return a.includes(b) || b.includes(a);
                }))
            } else {
                return true;
            }
        }
    }

    return (
        <div className='leftDiv'>
            <div className='leftContent'>
                <input type="text" className="searchPlayer" onChange={onChangeQuery}></input>
                <button className="toggleRecent" onClick={()=>{setShowRecent(!showRecent)}}>{showRecent?"⚔️":"🏝"}</button>
                <PlayerTable players={players.filter(playerFilter)}/>
            </div>
        </div>
    )
}

export default PlayerDiv;