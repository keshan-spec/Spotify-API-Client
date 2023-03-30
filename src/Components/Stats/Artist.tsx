import React, { useEffect, useState } from 'react'
import { SpotifyApi } from '../../spotify-api/SpotifyApi';
import { getAccessTokenDecoded, resetTokens } from '../../spotify-api/Tokens';
import { useLocation } from 'react-router-dom'
import { Loading } from '../Loading/Loading';


export const Artist: React.FC = () => {

    const [artist, setArtist] = useState<[]>();
    const [loading, setLoading] = useState(true);

    const location = useLocation()
    const state = location.state as { id: string }

    useEffect(() => {
        resetTokens().then(() => {
            const token = getAccessTokenDecoded()
            const api = new SpotifyApi(token)
            api.getArtist(state?.id)
                .then((res: any) => {
                    console.log(res);

                    setArtist([res])
                    setLoading(false)
                })
                .catch(err => { setLoading(true) })
        })
    }, [state])

    return (
        <>
            <h1 className='title__api'>Your Top Artists</h1>
            <div className='' >
                {loading ? <Loading /> : artist && artist.map((item: any, idx: number) => {
                    return (<div>
                        <img src={item.images[0].url} alt='cover' />
                        <h1>{item.name}</h1>
                        <a href={item.external_urls.spotify} target="_"> Spotify </a>
                        <p>{item.genres.map((genre: string) => <span className='genre'>{genre}</span>)}</p>

                        <p>Followers {item.followers.total}</p>
                        <p>Popularity {item.popularity}</p>
                    </div>)
                })
                }
            </div >
        </>
    );
}