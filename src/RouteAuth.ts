import { GuardFunction } from 'react-router-guards';
import { checkTokenValidity, refreshAccessToken, setAccessToken } from './spotify-api/Tokens';


export const checkAuth: GuardFunction = async (to, from, next) => {
    const valid = checkTokenValidity()
    if (!valid) {
        try {
            const data = await (await refreshAccessToken()).json()
            if (data && !data.ok) throw Error(`[TOKEN ERR] ${data.message}`)
            setAccessToken(data.accessToken)
        } catch (error) {
            console.log(error);
            next.redirect("/login")
        }
    }
    next()
}