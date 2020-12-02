import jwtDecode from 'jwt-decode'

let accessToken = ""

export const setAccessToken = (token: string) => { accessToken = token }
export const getAccessToken = () => { return accessToken }
export const getAccessTokenDecoded = () => {
    try {
        const data = jwtDecode(getAccessToken()) as any
        return data.spotifyAccessToken;
    } catch (error) {
        console.log(error);
        return ""
    }
}

// refresh the access token
export const refreshAccessToken = () => {
    return fetch("http://localhost:8888/refresh_token", { method: "POST", credentials: "include" })
}

export const checkTokenValidity = (): boolean => {
    const token = getAccessToken();
    if (!token) return false;
    try {
        const { exp } = jwtDecode(token) as any
        if (Date.now() >= exp * 1000) return false;
        else return true;
    } catch (error) { return false }
}

export const resetTokens = async () => {
    const valid = checkTokenValidity()
    if (!valid) {
        try {
            const data = await (await refreshAccessToken()).json()
            if (data && !data.ok) throw Error(`[TOKEN ERR] ${data.message}`)
            setAccessToken(data.accessToken)
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    return true
}