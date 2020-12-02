// https://dev.to/anobjectisa/build-a-chrome-extension-using-reactjs-38o7
import React from 'react';


export const Login: React.FC = () => {
    const submit = async () => { window.location.href = "http://localhost:8888/login" }
    return (
        <div className="login-section">
            <button className="login-btn" onClick={submit}>
                <i className="fa fa-spotify"></i>
                Login
            </button>
        </div>
    )
}

