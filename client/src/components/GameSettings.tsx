import { SetStateAction, useState } from "react";
import { socket } from '../pages/Lobby';

interface Props {

    setShowGameSettings: (value: SetStateAction<boolean>) => void,
    setShowNewGame: (value: SetStateAction<boolean>) => void

}

export interface Game {
    id: string,
    color: 'white' | 'black',
    player: string,
    duration: number
}

const GameSettings = ({ setShowGameSettings, setShowNewGame }: Props) => {

    const [game, setGame] = useState<Game>({
        id: socket.id,
        color: 'white',
        player: 'anonymous',
        duration: 5
    });

    return (
        <form onSubmit={event => {
            event.preventDefault();
            socket.emit('new game', game);
            setShowNewGame(false);
            setShowGameSettings(false);
        }}>
            <label htmlFor="nickname">Nickname:</label>
            <input type="text"
                id="nickname"
                name="nickname"
                onChange={event => setGame({ ...game, player: event.target.value })} /><br />
            <input type="radio"
                id="white"
                name="white"
                value="white"
                checked={game.color === 'white'}
                onChange={() => setGame({ ...game, color: 'white' })} />
            <label htmlFor="white">white</label><br />
            <input type="radio"
                id="black"
                name="black"
                checked={game.color === 'black'}
                value="black"
                onChange={() => setGame({ ...game, color: 'black' })} />
            <label htmlFor="black">black</label><br />
            <input
                type='number'
                min='1'
                max='60'
                required
                value={game.duration}
                onChange={event => setGame({ ...game, duration: +event.target.value })}
            /><span>minutes</span>
            <button type='submit'>Create Game</button>
            <button onClick={() => setShowGameSettings(false)}>Cancel</button>
        </form>
    );
}

export default GameSettings;