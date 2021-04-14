import { useEffect } from 'react';
import { displayAuthUi } from './firebase.js';

const LoginPage = ({auth}) => {
    useEffect(() => {
        displayAuthUi("#firebase-authui");
    }, []);

    return (
        <div style={{ textAlign: "center" }} >
            <div id="firebase-authui"></div>
        </div>
    );
}

export default LoginPage;