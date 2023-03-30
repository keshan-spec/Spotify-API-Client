import React, { useEffect, useState } from 'react'
import { SpotifyApi } from '../../spotify-api/SpotifyApi';
import { getAccessTokenDecoded, resetTokens } from '../../spotify-api/Tokens';
import { Loading } from '../Loading/Loading';
import { StatItem, StatProp } from './StatItem';

interface StatsCtx {
    data: any[]
}


export const Stats: React.FC = () => {

    const [stats, setStats] = useState<StatsCtx[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        resetTokens().then(() => {
            const token = getAccessTokenDecoded()
            const api = new SpotifyApi(token)
            api.getUserStats()
                .then((res: any) => {
                    setStats(res.items)
                    setLoading(false)
                })
                .catch(err => { setLoading(true) })
        })
    }, [])

    return (
        <>
            <h1 className="title__api">
                <a href="/" >
                    Spotify API <i className="fa fa-spotify"></i>
                </a>
            </h1>
            <h1 className='title__api'>Your Top Artists</h1>
            <div className='stats-section' >
                {loading ? <Loading /> : stats && stats.map((item: any, idx: number) => {
                    return <StatItem key={item.id} rank={idx + 1} followers={item.followers.total} genres={item.genres} id={item.id} images={item.images} name={item.name} popularity={item.popularity} url={item.external_urls.spotify} />
                })
                }
            </div>
        </>
    );
}