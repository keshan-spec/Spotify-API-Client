import request from 'request'
import querystring from 'query-string'

interface PlaylistCtx {
    playlist_name: string
    isPublic?: boolean
    desc?: string
}

export type Playlist = {
    name: string
    id: string
}

export class SpotifyApi {
    private token: string;

    constructor(token: string) { this.token = token }

    // search a song
    searchTracks(query: string, limit: number) {
        const url = "https://api.spotify.com/v1/search?" + querystring.stringify({
            q: query,
            type: "track",
            limit: limit
        })

        const options = {
            url,
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        return new Promise((resolve, reject) => {
            request.get(options, (err, res) => {
                try {
                    if (res.statusCode === 200) {
                        resolve(JSON.parse(res.body))
                    }
                    reject(res.body)
                } catch (error) {
                    reject(`Error ${error.message}`)
                }
            })
        })
    }

    // get the authenticated user
    getAuthUser = () => {
        const options = {
            url: "https://api.spotify.com/v1/me",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        return new Promise((resolve, reject) => {
            request.get(options, (err, res) => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(res.body))
                }
                reject(res.body)
            })
        })
    }

    // Create new playlist
    createPlaylist = async ({ isPublic, playlist_name, desc }: PlaylistCtx) => {
        const { user_id } = await this.getAuthUser() as any
        const options = {
            url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
            body: JSON.stringify({
                "name": playlist_name,
                "description": desc || "No Description",
                "public": isPublic || true
            }),
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }

        return new Promise((resolve, reject) => {
            request.post(options, (err, res) => {
                if (res.statusCode === 201) resolve(res.body)
                reject(res.body)
            })
        })
    }

    // Add tracks to a playlist
    addTracktoPlaylist = (playlist_id: string, tracks: string[]) => {
        const options = {
            url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            body: JSON.stringify({ "uris": tracks }),
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }

        return new Promise((resolve, reject) => {
            request.post(options, (err, res) => {
                if (res.statusCode === 201) resolve(res.statusCode)
                reject(res.statusCode)
            })
        })
    }

    // get playlist
    getUserPlaylists = () => {
        let playlists: Array<Playlist> = [];
        const options = {
            url: `https://api.spotify.com/v1/me/playlists`,
            headers: {
                "Authorization": `Bearer ${this.token}`
            },
            json: true
        }

        return new Promise<Playlist[]>((resolve, reject) => {
            request.get(options, (err, res) => {
                if (res.statusCode === 200) {
                    res.body.items.forEach((item: any) => { playlists.push({ name: item.name, id: item.id }) })
                    resolve(playlists)
                }
                reject(res.body)
            })
        })
    }

    // get user stats
    getUserStats = () => {
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
        const options = {
            url: `https://api.spotify.com/v1/me/top/artists?limit=10&time_range=long_term`,
            headers: {
                "Authorization": `Bearer ${this.token}`
            },
            json: true
        }
        return new Promise((resolve, reject) => {
            request.get(options, (err, res) => {
                if (res.statusCode === 200) resolve(res.body)
                reject(res.body)
            })
        })
    }

    getArtist = (artist_id: string) => {
        const options = {
            url: `https://api.spotify.com/v1/artists/${artist_id}`,
            headers: {
                "Authorization": `Bearer ${this.token}`
            },
            json: true
        }

        return new Promise((resolve, reject) => {
            request.get(options, (err, res) => {
                if (res.statusCode === 200) resolve(res.body)
                reject(res.body)
            })
        })
    }
}