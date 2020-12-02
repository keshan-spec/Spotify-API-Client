import React, { useState } from 'react';
import { SpotifyApi } from '../../spotify-api/SpotifyApi';
import { getAccessTokenDecoded, resetTokens } from '../../spotify-api/Tokens';
import ReactTooltip from 'react-tooltip';


interface Props {
    trackUri: string
    imgUrl: string
    imgAlt?: string
    songUrl: string
    songName: string
    artist: string
    album: string
    playlist: HTMLSelectElement | null
}
interface AddedSongCtx {
    complete: boolean
    error?: any
}

export const SongObj: React.FC<Props> = ({ imgUrl, imgAlt, artist, songName, songUrl, trackUri, album, playlist }) => {
    const [added, setAdded] = useState<AddedSongCtx>({ complete: false })

    let playlistID = playlist?.value!
    playlist?.addEventListener("change", () => { playlistID = playlist.value })

    const onclick = async () => {
        const ready = await resetTokens()
        if (ready) {
            const token = getAccessTokenDecoded()
            const api = new SpotifyApi(token)
            api.addTracktoPlaylist(playlistID, [trackUri])
                .then(res => { setAdded({ complete: true }) })
                .catch(err => {
                    setAdded({ error: err, complete: false })
                    console.log(err);
                })
        }
    }


    return (
        <div className="song_item_app">
            <ReactTooltip id='songTitle' type='dark' className='tooltiptext' getContent={(dataTip) => `${dataTip}`} />
            {!added.complete || added.error ?
                <div>
                    {added.error ? <p>Error adding song to playlist</p> : null}
                    <div className="song_item__cont">
                        <div className="img__app_container">
                            <img src={imgUrl} alt={imgAlt} />
                        </div>

                        <div className="song__details_app">
                            <span className="song__main_details">
                                <a className="song_title_app"
                                    data-tip={`${songName} by ${artist}`}
                                    data-for='songTitle'
                                    data-delay-show='300'
                                    data-border={true}
                                    href={songUrl}
                                    target="_"
                                    data-artist={`by ${artist}`}>
                                    {songName}
                                </a>
                            </span>
                            <span className="album__name">
                                {album}
                            </span>
                        </div>
                        <button className="btn-playlist" onClick={onclick}> <i className="fa fa-plus"></i></button>
                    </div>
                </div>
                : "Song Added"}
        </div>
    )
}