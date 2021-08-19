import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useHistory } from 'react-router';
import GameSettings from '../components/GameSettings';
import { Game } from '../components/GameSettings';

const socket = io('http://localhost:8000/');
export { socket };

const Lobby = () => {

    const history = useHistory();
    const [listOfGames, setListOfGames] = useState<Game[]>();
    const [showNewGame, setShowNewGame] = useState(true);
    const [showGameSettings, setShowGameSettings] = useState(false);




    useEffect(() => {

        socket.on('startGame', game => {
            history.push({
                pathname: `/game/${game.id}`,
                state: {
                    color: game.color,
                    duration: game.duration
                }
            });
        })
        socket.on('listOfGames', listOfGames => {
            setListOfGames(listOfGames);
        })

    }, [history]);

    return (
        <div>
            {showNewGame && (<button onClick={() => {
                setShowGameSettings(true);
            }}>Start New Game</button>)}

            {showGameSettings && (
                <GameSettings setShowGameSettings={setShowGameSettings} setShowNewGame={setShowNewGame} />)}
            <ul>
                {listOfGames && listOfGames.map(game => (
                    (
                        <div>
                            {`${game.player} as ${game.color}
                            ${game.duration} minutes game  `}
                            {game.id !== socket.id && (<button onClick={() => {
                                socket.emit('play', game);
                                history.push({
                                    pathname: `game/${game.id}`,
                                    state: {
                                        color: game.color === 'white' ? 'black' : 'white',
                                        duration: game.duration
                                    }
                                });
                            }}>Play</button>)}
                        </div>
                    )
                ))}
            </ul>
        </div>
    );

}

export default Lobby;