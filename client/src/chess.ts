import blackPawn from './images/black-pawn.png';
import whitePawn from './images/white-pawn.png';
import blackKing from './images/black-king.png';
import whiteKing from './images/white-king.png';
import blackQueen from './images/black-queen.png';
import whiteQueen from './images/white-queen.png';
import whiteKnight from './images/white-knight.png';
import blackKnight from './images/black-knight.png';
import blackBishop from './images/black-bishop.png';
import whiteBishop from './images/white-bishop.png';
import whiteRook from './images/white-rook.png';
import blackRook from './images/black-rook.png';

const file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export interface Piece {
    image: string;
    name: string;
    position: string;
    hasMoved: true | false;
    color: 'white' | 'black';
}

const gameMoves: string[] = []

export const fromAlgebricToInt = (position: string) => {
    return [8 - +position[1], position.charCodeAt(0) - 97];
}

const fromIntToAlgebric = (tuple: [number, number]) => {
    return String.fromCharCode(tuple[1] + 97) + (8 - tuple[0]);
}

export const getPiece = (position: string | [number, number], pieces: Piece[]): Piece | undefined => {
    if (typeof position === 'string') {
        return pieces.find(element => element.position === position);
    } else {
        return getPiece(fromIntToAlgebric(position), pieces);
    }

}


export const initialPosition = () => {

    const pieces: Piece[] = [];

    file.forEach(letter => {
        pieces.push({
            name: 'pawn',
            image: whitePawn,
            position: letter + '2',
            hasMoved: false,
            color: 'white'
        });
        pieces.push({
            name: 'pawn',
            image: blackPawn,
            position: letter + '7',
            hasMoved: false,
            color: 'black'
        });
        if (letter === 'a' || letter === 'h') {
            pieces.push({
                name: 'rook',
                image: whiteRook,
                position: letter + '1',
                hasMoved: false,
                color: 'white'
            });
            pieces.push({
                name: 'rook',
                image: blackRook,
                position: letter + '8',
                hasMoved: false,
                color: 'black'
            });
        }
        if (letter === 'b' || letter === 'g') {
            pieces.push({
                name: 'knight',
                image: whiteKnight,
                position: letter + '1',
                hasMoved: false,
                color: 'white'
            });
            pieces.push({
                name: 'knight',
                image: blackKnight,
                position: letter + '8',
                hasMoved: false,
                color: 'black'
            });
        }
        if (letter === 'c' || letter === 'f') {
            pieces.push({
                name: 'bishop',
                image: whiteBishop,
                position: letter + '1',
                hasMoved: false,
                color: 'white'
            });
            pieces.push({
                name: 'bishop',
                image: blackBishop,
                position: letter + '8',
                hasMoved: false,
                color: 'black'
            });
        }
        if (letter === 'd') {
            pieces.push({
                name: 'queen',
                image: whiteQueen,
                position: 'd1',
                hasMoved: false,
                color: 'white'
            });
            pieces.push({
                name: 'queen',
                image: blackQueen,
                position: 'd8',
                hasMoved: false,
                color: 'black'
            });
        }
        if (letter === 'e') {
            pieces.push({
                name: 'king',
                image: whiteKing,
                position: 'e1',
                hasMoved: false,
                color: 'white'
            });
            pieces.push({
                name: 'king',
                image: blackKing,
                position: 'e8',
                hasMoved: false,
                color: 'black'
            });
        }
    });

    return pieces;
}

const getPawnMoves = (pawn: Piece, pieces: Piece[]) => {

    let moves: string[] = [];
    let direction = pawn.color === 'white' ? -1 : 1;
    let [x, y] = fromAlgebricToInt(pawn.position);

    if (!getPiece(([x + direction, y]), pieces)) {
        moves.push(fromIntToAlgebric([x + direction, y]));
        if (!getPiece([x + 2 * direction, y], pieces) && !pawn.hasMoved) {
            moves.push(fromIntToAlgebric([x + 2 * direction, y]));
        }
    }

    let capturePieceColor = getPiece([x + direction, y - 1], pieces)?.color ?? pawn.color;

    if (y > 0 && capturePieceColor !== pawn.color) {
        moves.push(fromIntToAlgebric([x + direction, y - 1]));
    }

    capturePieceColor = getPiece([x + direction, y + 1], pieces)?.color ?? pawn.color;

    if (y < 7 && capturePieceColor !== pawn.color) {
        moves.push(fromIntToAlgebric([x + direction, y + 1]));
    }
    //enpassan
    if (x === (direction + 7) / 2) {
        let lastMove = gameMoves[gameMoves.length - 1];
        let [xStart, yStart] = fromAlgebricToInt(lastMove.split(' ')[0]);
        let [xEnd, yEnd] = fromAlgebricToInt(lastMove.split(' ')[1]);
        let piece = getPiece([xEnd, yEnd], pieces);
        if (piece?.name === 'pawn' && Math.abs(xEnd - xStart) === 2 && Math.abs(yStart - y) === 1) {
            moves.push(fromIntToAlgebric([x + direction, yStart]));
        }
    }

    return moves;
}

const getKnightMoves = (knight: Piece, pieces: Piece[]) => {
    let moves: string[] = [];
    let [x, y] = fromAlgebricToInt(knight.position);
    let jumps = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

    jumps.forEach(jump => {
        let xPosition = x + jump[0];
        let yPosition = y + jump[1];
        let capturePieceColor = getPiece([xPosition, yPosition], pieces)?.color ?? '';
        if (capturePieceColor !== knight.color
            && xPosition >= 0
            && xPosition < 8
            && yPosition >= 0
            && yPosition < 8) {
            moves.push(fromIntToAlgebric([xPosition, yPosition]));
        }
    });

    return moves;
}

const addPositions = (positions: [number, number][], piece: Piece, pieces: Piece[]) => {

    let moves: string[] = [];

    let [x, y] = fromAlgebricToInt(piece.position);

    for (let position of positions) {

        let xPosition = x + position[0];
        let yPosition = y + position[1];
        if (xPosition >= 0 && xPosition < 8 && yPosition >= 0 && yPosition < 8) {
            let capturePiece = getPiece([xPosition, yPosition], pieces);
            if (!capturePiece) {
                moves.push(fromIntToAlgebric([xPosition, yPosition]));
            } else {
                if (capturePiece.color !== piece.color) {
                    moves.push(fromIntToAlgebric([xPosition, yPosition]));
                }
                break;
            }
        }
    }
    return moves;
}

const getBishopMoves = (bishop: Piece, pieces: Piece[]) => {

    let moves: string[] = [];

    let positions: [number, number][] = [];

    for (let i = 1; i < 8; i++) {
        positions.push([i, i]);
    }


    return moves.concat(
        addPositions(positions, bishop, pieces),
        addPositions(positions.map(position => [position[0], -position[1]]), bishop, pieces),
        addPositions(positions.map(position => [-position[0], position[1]]), bishop, pieces),
        addPositions(positions.map(position => [-position[0], -position[1]]), bishop, pieces)
    );
}

const getRookMoves = (rook: Piece, pieces: Piece[]) => {

    let moves: string[] = [];

    let positions: [number, number][] = [];

    for (let i = 1; i < 8; i++) {
        positions.push([i, 0]);
    }

    return moves.concat(
        addPositions(positions, rook, pieces),
        addPositions(positions.map(position => [-position[0], 0]), rook, pieces),
        addPositions(positions.map(position => [0, position[0]]), rook, pieces),
        addPositions(positions.map(position => [0, -position[0]]), rook, pieces)
    );
}

const getQueenMoves = (queen: Piece, pieces: Piece[]) => {

    let moves: string[] = [];

    return moves.concat(
        getBishopMoves(queen, pieces),
        getRookMoves(queen, pieces)
    );
}

const getAdjacentSquares = (position: string) => {

    let [x, y] = fromAlgebricToInt(position);
    let adjacentSquares: string[] = [];

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) continue;
            if (x + i >= 0 && x + i < 8 && y + j >= 0 && y + j < 8) {
                adjacentSquares.push(fromIntToAlgebric([x + i, y + j]));
            }
        }
    }
    return adjacentSquares;
}

const getAtackedSquares = (piece: Piece, pieces: Piece[]) => {

    switch (piece.name) {
        case 'pawn':
            {
                let [x, y] = fromAlgebricToInt(piece.position);
                let moves: string[] = [];
                let direction = piece.color === 'white' ? -1 : 1;

                if (y > 0) {
                    moves.push(fromIntToAlgebric([x + direction, y - 1]));
                }

                if (y < 7) {
                    moves.push(fromIntToAlgebric([x + direction, y + 1]));
                }

                return moves;
            }
        case 'knight':
            return getKnightMoves(piece, pieces);
        case 'bishop':
            return getBishopMoves(piece, pieces);
        case 'rook':
            return getRookMoves(piece, pieces);
        case 'queen':
            return getQueenMoves(piece, pieces);
        case 'king':
            return getAdjacentSquares(piece.position);
        default:
            return [''];

    }
}

const isAtacked = (position: string, color: 'white' | 'black', pieces: Piece[]) => {
    return pieces
        .filter(element => element.color !== color)
        .some(element => getAtackedSquares(element, pieces).includes(position));
}


const isCheck = (color: 'white' | 'black', pieces: Piece[]): boolean => {
    let kingPosition = pieces
        .find(element => (element.color === color && element.name === 'king'))?.position ?? '';
    return isAtacked(kingPosition, color, pieces);
}


const getKingMoves = (king: Piece, pieces: Piece[]) => {

    let moves: string[] = [];

    let adjacentSquares = getAdjacentSquares(king.position);

    adjacentSquares.forEach(square => {
        if (getPiece(square, pieces)?.color !== king.color) {
            moves.push(square);
        }
    })
    let [x, y] = fromAlgebricToInt(king.position);
    //short castle
    if (!king.hasMoved
        && !getPiece([x, y + 3], pieces)?.hasMoved
        && !getPiece([x, y + 1], pieces)
        && !getPiece([x, y + 2], pieces)
        && !isCheck(king.color, pieces)
        && !isAtacked(fromIntToAlgebric([x, y + 1]), king.color, pieces)
        && !isAtacked(fromIntToAlgebric([x, y + 2]), king.color, pieces)
    ) {
        moves.push(fromIntToAlgebric([x, y + 2]));
    }
    //long castle
    if (!king.hasMoved
        && !getPiece([x, y - 4], pieces)?.hasMoved
        && !getPiece([x, y - 1], pieces)
        && !getPiece([x, y - 2], pieces)
        && !isCheck(king.color, pieces)
        && !isAtacked(fromIntToAlgebric([x, y - 1]), king.color, pieces)
        && !isAtacked(fromIntToAlgebric([x, y - 2]), king.color, pieces)
    ) {
        moves.push(fromIntToAlgebric([x, y - 2]));
    }

    return moves;
}

export const getLegalMoves = (piece: Piece | undefined, pieces: Piece[]) => {

    if (!piece) {
        return [''];
    }

    let legalMoves: string[];

    switch (piece.name) {
        case 'pawn':
            legalMoves = getPawnMoves(piece, pieces);
            break;
        case 'knight':
            legalMoves = getKnightMoves(piece, pieces);
            break;
        case 'bishop':
            legalMoves = getBishopMoves(piece, pieces);
            break;
        case 'rook':
            legalMoves = getRookMoves(piece, pieces);
            break;
        case 'queen':
            legalMoves = getQueenMoves(piece, pieces);
            break;
        case 'king':
            legalMoves = getKingMoves(piece, pieces);
            break;
        default:
            legalMoves = [''];
    }

    return legalMoves
        .filter(newPosition => !isCheck(piece.color, _move(piece, newPosition, pieces)));
}

const getAllLegalMoves = (color: 'white' | 'black', pieces: Piece[]) => {
    return new Set(
        pieces
            .filter(element => element.color === color)
            .map(element => getLegalMoves(element, pieces))
            .reduce((a, b) => a.concat(b))
    );
}

export const getStatus = (color: 'white' | 'black', pieces: Piece[]) => {
    let moves = getAllLegalMoves(color, pieces);
    if (moves.size === 0) {
        if (isCheck(color, pieces)) return 'Checkmate';
        return 'Stalemate';
    }
}

const _move = (piece: Piece, moveTo: string, pieces: Piece[],
    promote: 'queen' | 'bishop' | 'rook' | 'knight' = 'queen'): Piece[] => {

    let [x1, y1] = fromAlgebricToInt(piece.position);
    let [x2, y2] = fromAlgebricToInt(moveTo);
    //castle
    if (piece.name === 'king' && Math.abs(y2 - y1) === 2) {
        return pieces.map(element => {
            if (element.position === piece.position) {
                return { ...element, position: moveTo, hasMoved: true };
            }
            if (y2 > y1 && element.position === fromIntToAlgebric([x2, y2 + 1])) {
                return { ...element, position: fromIntToAlgebric([x1, y1 + 1]), hasMoved: true };
            }
            if (y2 < y1 && element.position === fromIntToAlgebric([x2, y2 - 2])) {
                return { ...element, position: fromIntToAlgebric([x1, y1 - 1]), hasMoved: true };
            }
            return element;
        });
    }
    //promotion
    if (piece.name === 'pawn' && (x2 === 0 || x2 === 7)) {
        return pieces
            .filter(element => (element.position !== moveTo))
            .map(element => {
                if (element.position === piece.position) {
                    let image = element.color === 'white' ? whiteQueen : blackQueen;
                    //let promotePiece;
                    let queen: Piece = {
                        name: 'queen',
                        image: image,
                        position: moveTo,
                        hasMoved: true,
                        color: element.color
                    };
                    return (queen);
                } else {
                    return element;
                }
            });
    }
    //enpassan
    if (piece.name === 'pawn' && Math.abs(y2 - y1) === 1 && !getPiece(moveTo, pieces)) {
        return pieces
            .filter(element => element.position !== fromIntToAlgebric([x1, y2]))
            .map(element => {
                if (element.position === piece.position) {
                    return { ...element, position: moveTo };
                } else {
                    return element;
                }
            });
    }

    return pieces
        .filter(element => element.position !== moveTo)
        .map(element => {
            if (element.position === piece.position) {
                return { ...element, position: moveTo, hasMoved: true }
            } else {
                return element;
            }
        });
}

export const move = (piece: Piece | string | undefined, moveTo: string, pieces: Piece[],
    promote: 'queen' | 'bishop' | 'rook' | 'knight' = 'queen'): Piece[] => {
    if (typeof piece === 'string') {
        return move(getPiece(piece, pieces), moveTo, pieces);
    }

    if (!piece || !getLegalMoves(piece, pieces).includes(moveTo)) {
        return pieces;
    }

    gameMoves.push(`${piece.position} ${moveTo}`);
    console.log(Math.ceil(gameMoves.length / 2), gameMoves[gameMoves.length - 1]);
    return _move(piece, moveTo, pieces, promote);
}

//draw => 3fold repetition, insufficient material, 50 move rule