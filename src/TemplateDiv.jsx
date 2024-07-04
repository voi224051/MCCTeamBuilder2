import "./TemplateDiv.css"
import { useState, useContext, useRef, useEffect } from 'react'
import { PlayersContext } from "./App"

import getRegularImage from "./assets/templates/regular/export"
import getAllStarImage from "./assets/templates/allstars/export"
import getRisingImage from "./assets/templates/rising/export"
import getTeamIcon from "./assets/icons/export"

const getTemplate = (type, color) => {
    switch(type) {
        case 'regular':
            return getRegularImage(color);
        case 'allstars':
            return getAllStarImage(color);
        case 'rising':
            return getRisingImage(color);
        default:
            console.log("No such image!");
            return "";
    }
}

const NameSlot = ({idx, dark, editMode, setEdittingName}) => {
    const players = useContext(PlayersContext).players;
    const setPlayers = useContext(PlayersContext).setPlayers;

    const onSubmit = (e) => {
        if (e.key === 'Enter') {
            setEdittingName(-1);
            setPlayers(
                players.slice(0, idx)
                .concat([{
                    id: idx,
                    name: e.target.value,
                    src: players[idx].src,
                }])
                .concat(players.slice(idx+1)))
        }
    }

    if (!editMode) {
        return (
            <div className="nameContainer" id={`name${idx}`} key={`name${idx}`}>
                <p 
                    className={"name" + (dark ? " blackText" : " whiteText")}
                    onClick={()=>{setEdittingName(idx)}}
                >{players[idx].name}</p>
            </div>
        )
    }

    return (
        <div className="nameContainer" id={`name${idx}`} key={`name${idx}`}>
            <input
                type="text" 
                className={"name" + (dark ? " blackText" : " whiteText")}
                onKeyPress={onSubmit}
                defaultValue={players[idx].name}
            />
        </div>
    )
}

const Slots = ({dark}) => {
    const players = useContext(PlayersContext).players;
    const setPlayers = useContext(PlayersContext).setPlayers;
    const [edittingName, setEdittingName] = useState(-1);

    const onDragOver = e => {e.preventDefault()};

    const onDragStartPic = (e, idx) => {
        e.dataTransfer.setData("start-point", `${idx}`);
        e.dataTransfer.setData("drag-player", `{ "name": "${players[idx].name}", "src": "${players[idx].src}" }`);
    }

    const onDropSlot = (e, idx) => {
        const newPlayer = JSON.parse(e.dataTransfer.getData("drag-player"));
        setPlayers(
            players.slice(0, idx)
                .concat([{
                    id: idx,
                    name: newPlayer.name,
                    src: newPlayer.src,
                }])
                .concat(players.slice(idx+1))
        );
    }

    const onDropPic = (e, idx) => {
        e.stopPropagation();

        const startingPoint = e.dataTransfer.getData('start-point');
        const newPlayer = JSON.parse(e.dataTransfer.getData("drag-player"));
        if (startingPoint === 'table') {
            setPlayers(
                players.slice(0, idx)
                    .concat([{
                        id: idx,
                        name: newPlayer.name,
                        src: newPlayer.src,
                    }])
                    .concat(players.slice(idx+1))
            );
        } else {
            const spIdx = parseInt(startingPoint);
            if (spIdx !== idx) {
                let newPlayersArr = [];
                for (let i=0; i<4; i++) {
                    if (i === idx) {
                        newPlayersArr.push({
                            id: i,
                            name: newPlayer.name,
                            src: newPlayer.src,
                        })
                    } else if (i === spIdx) {
                        newPlayersArr.push({
                            id: i,
                            name: players[idx].name,
                            src: players[idx].src,
                        })
                    } else {
                        newPlayersArr.push(players[i])
                    }
                }
                setPlayers(newPlayersArr);
            }
        }
    }

    const slots = [0,1,2,3].map(idx => {
        return (
            <div 
                className="slot" id={`slot${idx}`} key={`slot${idx}`}
                onDragOver={onDragOver} onDrop={(e)=>{onDropSlot(e, idx)}}
            >
                <img className="playerImg" src={players[idx].src} alt={`${players[idx].name}`}
                draggable={players[idx].src !== ""} onDragStart={(e)=>{onDragStartPic(e, idx)}}
                onDragOver={onDragOver} onDrop={(e)=>{onDropPic(e, idx)}}
                />
            </div>
        )
    });

    const names = [0,1,2,3].map(idx => 
        <NameSlot idx={idx} key={`name${idx}`} dark={dark} editMode={edittingName === idx} setEdittingName={setEdittingName} />
    )

    return (
        <div className="slotsDiv">
            <div className="slotsContainer">
                {slots}
                {names}
            </div>
        </div>
    )
}

const TemplateContents = ({type, color}) => {
    let src = getTemplate(type, color);

    return (
        <div className="templateContents">
            <div className="templateContainer">
                <img className="template" alt={`Template: ${type} ${color}`} src={src} />
            </div>
            <Slots dark={type === "regular"} />
        </div>
    )
}

const ButtonsContainer = ({setNextType, setColor, allColor, toggleShowResult}) => {

    return (
        <div className="buttonsContainer">
            {allColor.map(color => 
                <div key={color} className="btnContainer">
                    <img src={getTeamIcon(color)} className="colorIcon" alt={`${color} team`}
                        draggable={false} onClick={()=>{setColor(color)}} 
                    />
                </div>
            )}
            <div className="btnContainer typeCon">
                <button className="btn" onClick={setNextType}>🢅</button>
            </div>
            <div className="btnContainer finishCon">
                <button className="btn" onClick={toggleShowResult}>✔️</button>
            </div>
        </div>
    )
}
const ResultDiv = ({type, color, toggleShowResult}) => {
    const canvasRef = useRef(null)
    const players = useContext(PlayersContext).players;
    
    useEffect(() => {
        const cvs = canvasRef.current
        const ctx = cvs.getContext('2d')
        
        let template = new Image();
            template.setAttribute('src', getTemplate(type, color));
            ctx.drawImage(template, 0, 0, template.width, template.height, 0, 0, cvs.width, cvs.height);
    
            let slotInitX = 140;
            let slotInitY = 325;
            let slotSepaX = 388;
            for (let i=0; i<4; i++) {
                let x = slotInitX + slotSepaX * i;
                let y = slotInitY;
    
                let slot = new Image();
                slot.setAttribute('src', players[i].src);
                ctx.drawImage(slot, 0, 0, slot.width, slot.height, x, y, 334, 334);
    
                ctx.textAlign = 'center';
                ctx.font = '30px Minecraftia'
    
                if (type==='regular') {
                    ctx.fillStyle = 'black';
                } else {
                    ctx.fillStyle = 'white';
                }
    
                ctx.fillText(players[i].name, 310 + slotSepaX * i, 725);
            }
    }, [color, players, type])

    return (
        <div className="resultDiv">
            <div className="resultCanvasContainer"><canvas className="resultCanvas" width={1778} height={1000} ref={canvasRef} /></div>
            <div className="resultCloseBtnContainer"><button className="resultCloseBtn" onClick={toggleShowResult}>✔️</button></div>
        </div>
    )
}

const TemplateDiv = () => {
    const [type, setType] = useState('regular');
    const [color, setColor] = useState('Red');
    const [showResult, setShowResult] = useState(false);

    const allColor = ["Red", "Orange", "Yellow", "Lime", "Green", "Aqua", "Cyan", "Blue", "Purple", "Pink"];
    const setNextType = () => {
        const allType = ["regular", "allstars", "rising"];
        const originIdx = allType.indexOf(type);

        if (originIdx === allType.length - 1) setType(allType[0]);
        else setType(allType[originIdx + 1]);
    }
    const toggleShowResult = () => {setShowResult(!showResult)};

    return (
        <div className='rightDiv'>
            <div className="rightContent">
                <TemplateContents type={type} color={color} />
                <ButtonsContainer setNextType={setNextType} setColor={setColor} allColor={allColor} toggleShowResult={toggleShowResult} />
            </div>
            {showResult? <ResultDiv type={type} color={color} toggleShowResult={toggleShowResult} /> : <></>}
        </div>
    )
}

export default TemplateDiv