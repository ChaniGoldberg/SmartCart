
import React from 'react';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const GoogleLoginButton: React.FC = () => {

    const handleLogin = (credentialResponse: any) => {

        const token = credentialResponse.credential; // הטוקן שנשלח

        console.log("Token: ", token);

        // כאן ניתן להוסיף קוד נוסף לטיפול במידע

    };


    return (

        <GoogleOAuthProvider clientId="747858092491-ljjstqsqthgmptreqfcipuo6g2d9ou49.apps.googleusercontent.com">

            <GoogleLogin

                onSuccess={handleLogin}
                // onError={(error) => console.error("Login Failed:", error)}
                // onSuccessMessage="Login Successful"

           //     onFailure={(error) => console.error("Login Failed:", error)}

            />

        </GoogleOAuthProvider>

    );

};


export default GoogleLoginButton;

