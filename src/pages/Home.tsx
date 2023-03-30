import React from 'react'
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
    return (<header>
        <div>
            <Link to="/a"> Protected</Link>
            <Link to="/v"> Public</Link>
            <Link to="/search"> Search</Link>
            <Link to="/stats"> Stats</Link>
        </div>
    </header>);
}