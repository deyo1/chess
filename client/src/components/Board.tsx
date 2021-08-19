import Square from "./Square";

import './Board.css';

import { getPiece, Piece } from "../chess";

interface Props {
    handleMove: (position: string) => void,
    pieces: Piece[],
    legalMoves: string[],
    player: 'white' | 'black'
}


const Board = ({ handleMove, pieces, legalMoves, player }: Props) => {

    const file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rank = ['8', '7', '6', '5', '4', '3', '2', '1'];

    if (player === 'black') {
        file.reverse();
        rank.reverse();
    }

    return (
        <div className='board'>
            <table>
                <tbody>
                    {rank.map(number => (
                        <tr>
                            {file.map(letter => {
                                return (
                                    <td onClick={() => handleMove(letter + number)}>
                                        <Square position={letter + number}
                                            image={getPiece(letter + number, pieces)?.image ?? ''}
                                            isLegalMove={legalMoves.includes(letter + number)}
                                        />
                                    </td>
                                );

                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Board;