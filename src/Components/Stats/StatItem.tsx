import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion/dist/framer-motion"

export interface StatProp {
    name: string
    id: string
    images: { height: number, url: string, width: number }[]
    popularity: number
    followers: number
    genres: string[]
    url: string
    rank: number
}

export const StatItem: React.FC<StatProp> = ({ followers, genres, id, images, name, popularity, url, rank }) => {
    return (
        <Link to={{
            pathname: "artist/",
            state: {
                id,
            },
        }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                <div className="cover">
                    <img src={images[0].url} alt="cover" />
                    <a className="play-icon" href={url} target="_">
                        <i className="fa fa-play"></i>
                    </a>
                </div>
                <div className="card-content">
                    <h4>#{rank} {name}</h4>
                    <p>{genres.map(genre => <span className='genre'>{genre}</span>)}</p>
                </div>
            </motion.div>
        </Link>
    );
}