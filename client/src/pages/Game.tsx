import Board from "../components/Board";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router";
import { io } from 'socket.io-client';
import { initialPosition, getPiece, getLegalMoves, move, getStatus, Piece } from "../chess";
import Clock from "../components/Clock";


export interface State {
    pieces: Piece[],
    onMove: 'white' | 'black',
    movingPiece: Piece | undefined
}

interface Location {
    color: 'white' | 'black',
    duration: number
}

const socket = io('http://localhost:8000/');


const Game = () => {

    const [game, setGame] = useState(false);
    const player: 'white' | 'black' = useLocation<Location>().state.color;
    const gameDuration = useLocation<Location>().state.duration;
    const room = useLocation().pathname.split('/').pop();
    const [whiteTime, setWhiteTime] = useState<number>(+gameDuration * 60000);
    const [blackTime, setBlackTime] = useState<number>(+gameDuration * 60000);
    const timeRef = useRef<number>(Date.now());

    const [state, setState] = useState<State>({
        pieces: initialPosition(),
        onMove: 'white',
        movingPiece: undefined
    });

    const legalMoves = getLegalMoves(state.movingPiece, state.pieces);

    const handleMove = useCallback((position: string) => {

        if (player !== state.onMove || !game) return;

        if (!state.movingPiece || state.movingPiece.position !== position) {
            let piece = getPiece(position, state.pieces);
            let legalMoves = getLegalMoves(piece, state.pieces);
            if (legalMoves[0] && piece?.color === state.onMove) {
                setState(previousState => ({
                    ...previousState,
                    movingPiece: piece
                }));

                return;
            }
        }
        if (state.movingPiece && legalMoves.includes(position)) {

            let newPlayer: 'white' | 'black' = state.onMove === 'white' ? 'black' : 'white';
            let newPosition = move(state.movingPiece, position, state.pieces);
            setState({
                pieces: newPosition,
                movingPiece: undefined,
                onMove: newPlayer
            });
            timeRef.current = Date.now();
            socket.emit('move', room, `${state.movingPiece.position} ${position}`, timeRef.current);
            return;
        }

        setState(previousState => ({
            ...previousState,
            movingPiece: undefined
        }));

    }, [legalMoves, player, room, state, game]);

    useEffect(() => {
        let status = getStatus(state.onMove, state.pieces);
        if (status) {
            setGame(false);
            console.log(status);
            setTimeout(() => alert(status), 100);
        }
    }, [state]);

    useEffect(() => {
        if (!game) {
            socket.emit('gameEnd', room);
        }

    }, [game, room]);

    useEffect(() => {
        socket.emit('startOfGame', room);
        socket.on('startOfGame', (time: number) => {
            timeRef.current = time;
            setGame(true);
        });
    }, [room, player])

    useEffect(() => {
        socket.on('move', (newMove: string, time: number) => {
            timeRef.current = time;
            const [start, end] = newMove.split(' ');
            setState(previousState => {
                let newPosition = move(start, end, previousState.pieces);
                let newPlayer: 'white' | 'black' = previousState.onMove === 'white' ? 'black' : 'white'
                return ({
                    pieces: newPosition,
                    onMove: newPlayer,
                    movingPiece: undefined
                });
            })
        })
    }, []);


    return (
        <>
            <Clock
                player={player === 'white' ? 'black' : 'white'}
                isPlaying={player !== state.onMove}
                gameDuration={player === 'white' ? blackTime : whiteTime}
                setClock={player === 'white' ? setBlackTime : setWhiteTime}
                setGame={setGame}
                game={game}
                timeRef={timeRef.current} />
            <Board
                handleMove={handleMove}
                pieces={state.pieces}
                legalMoves={legalMoves}
                player={player} />

            <Clock
                player={player}
                isPlaying={player === state.onMove}
                gameDuration={player === 'white' ? whiteTime : blackTime}
                setClock={player === 'white' ? setWhiteTime : setBlackTime}
                setGame={setGame}
                game={game}
                timeRef={timeRef.current} />
        </>
    );
}

export default Game;