import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { refreshAccessToken, setAccessToken } from './spotify-api/Tokens';
import Routes from './Routes';
import { Loading } from './Components/Loading/Loading';
import { Login } from './pages/Login';
import './styles/index.css'
import 'font-awesome/css/font-awesome.min.css';


export const App: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // try to refresh token if error make user login
    useEffect(() => {
        refreshAccessToken()
            .then(async (res) => {
                const data = await res.json()
                if (data.ok) {
                    setAccessToken(data.accessToken);
                    setLoading(false)
                } else {
                    console.log(data.message);
                    setError(true)
                }
            })
            .catch(err => {
                if (err.message === "Failed to fetch") {
                    console.log("Connection error");
                }
                console.log(err);
                setError(true)
            })
    }, [])


    return (
        <div className="main__app_container">
            {error ? <Login /> : null}
            {!error && !loading ? <Routes /> : null}
            {loading && !error ? <Loading /> : null}
        </div>
    )
};


ReactDOM.render(<App />, document.getElementById('root'));

