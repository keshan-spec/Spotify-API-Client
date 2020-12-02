import React, { useRef, useState } from 'react';
import { SpotifyApi } from '../../spotify-api/SpotifyApi';
import { getAccessTokenDecoded, resetTokens } from '../../spotify-api/Tokens';
import { Loading } from '../Loading/Loading';
import { SongObj } from "./SongItem";
import svg from './telescope.svg'
import svg2 from './noresults.svg'

type Playlist = {
    name: string
    id: string
}

interface Query {
    data: any[]
    isReady: boolean
    error?: boolean
}

export const SearchForm: React.FC = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const numRef = useRef<HTMLInputElement | null>(null);
    const playlistRef = useRef<HTMLSelectElement | null>(null);

    const [query, setQuery] = useState<Query>({ data: [], isReady: true })
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    const getPlaylists = () => {
        if (playlists.length === 0) {
            const token = getAccessTokenDecoded()
            const api = new SpotifyApi(token)
            api.getUserPlaylists().then(res => {
                setPlaylists(res)
            })
        }
        return (
            <div className="playlists_dropdown_app">
                <select ref={playlistRef}>
                    {playlists?.map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
            </div>
        )
    }

    const search = async (q: string, limit: number) => {
        const ready = await resetTokens()
        if (q.length >= 1 && ready) {
            setQuery({ data: [], isReady: false, error: false });
            const token = getAccessTokenDecoded()
            const api = new SpotifyApi(token)
            api.searchTracks(q, limit)
                .then((data: any) => {
                    setQuery({ data: data.tracks.items, isReady: true, error: false });
                }).catch(err => {
                    setQuery({ data: [], isReady: true, error: true });
                    console.log(err);
                })
        }
    }

    const getSongItems = () => {
        if (query?.isReady && !query.error && query.data.length !== 0) {
            return (
                <div style={{ width: '100%', padding: '10px' }}>
                    {query.data.map((e, index) => {
                        return <SongObj
                            key={index}
                            trackUri={e.uri}
                            artist={e.artists[0].name}
                            imgUrl={e.album.images[0].url}
                            imgAlt={e.name}
                            songName={e.name}
                            songUrl={e.external_urls.spotify}
                            album={e.album.name}
                            playlist={playlistRef.current}
                        />
                    })}
                </div>
            )
        } else if (!query?.isReady) {
            return <Loading />
        }
        else if (query.isReady && query.data.length === 0) {
            return (
                <span className="error">
                    <img src={svg} className="svg__telescope" alt="" />
                No Songs Found
                </span>
            )
        }
        else if (query.error) {
            return (
                <span className="error">
                    <img src={svg2} className="svg__telescope" alt="" />
                There was an error.
                </span>
            )
        }
    }

    return (
        <div className="search__app_container">
            <h1 className="title__api">
                <a href="/" >
                    Spotify API <i className="fa fa-spotify"></i>
                </a>
            </h1>
            <div className="search-form">
                <input type="number" min={1} max={10} defaultValue={3} ref={numRef} />
                <input type="text" placeholder="Enter the song name" ref={inputRef}
                    onKeyPress={(e) => e.key === "Enter" ? search(inputRef.current?.value!, +numRef.current?.value!) : null} />
                <button className="search__btn_app"
                    disabled={!query.isReady}
                    onClick={e => search(inputRef.current?.value!, +numRef.current?.value!)}>
                    <i className="fa fa-search"></i>
                </button>
            </div>

            {getPlaylists()}
            {getSongItems()}
        </div>
    )
}