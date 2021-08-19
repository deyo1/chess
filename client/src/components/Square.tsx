import './Square.css';

import { fromAlgebricToInt } from "../chess";

interface Props {
    position: string;
    image: string,
    isLegalMove: true | false
}

const Square = ({ position, image, isLegalMove }: Props) => {

    let [x, y] = fromAlgebricToInt(position);
    const className = (x + y) % 2 === 1 ? 'black' : 'white';

    return (
        <div className={`${className} ${isLegalMove && 'showLegalMove'}`}>
            <img src={image} alt='' />
        </div>
    );
}

export default Square;