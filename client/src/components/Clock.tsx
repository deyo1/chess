import { useEffect, useState, SetStateAction } from "react";

interface Props {
    player: 'white' | 'black',
    isPlaying: boolean,
    gameDuration: number,
    setGame: (value: SetStateAction<boolean>) => void,
    setClock: (value: SetStateAction<number>) => void,
    game: boolean,
    timeRef: number
}

export const getMinutesAndSeconds = (miliseconds: number) => {
    let minutes: number | string = Math.floor(miliseconds / 60000);
    let seconds: number | string = Math.ceil((miliseconds - 60000 * minutes) / 1000);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return (`${minutes}:${seconds}`);
}

const Clock = ({ player, isPlaying, gameDuration, setClock, setGame, game, timeRef }: Props) => {

    const [time, setTime] = useState(gameDuration);
    const [, setTimer] = useState<NodeJS.Timeout>();

    useEffect(() => {

        const clearTimer = () => {
            setTimer(previousTimer => {
                if (previousTimer) {
                    clearInterval(previousTimer);
                }
                return undefined;
            });
        }

        if (!game || !isPlaying) {
            clearTimer();
            setTime(previousTime => {
                setClock(previousTime);
                return previousTime;
            })
        } else {
            clearTimer();
            setTimer(setInterval(() => {
                setTime(previousTime => {
                    if (previousTime <= 0) {
                        clearTimer();
                        setGame(false);
                        setTimeout(() => alert(`${player} lost on time`), 500);
                        return 0;
                    }
                    let passedTime = Date.now() - timeRef;
                    return (gameDuration - passedTime);
                })
            }, 1000));
        }
    }, [isPlaying, player, game, setGame, timeRef, gameDuration, setClock]);


    return (
        <div style={{ textAlign: 'center' }}>
            {getMinutesAndSeconds(time)}
        </div>
    );
}

export default Clock;