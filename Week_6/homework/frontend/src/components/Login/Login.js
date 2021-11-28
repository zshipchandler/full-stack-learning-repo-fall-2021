import React from "react";
import { useHistory } from "react-router-dom";
import { auth, firebase } from "../Firebase/firebase.js";

export default function LoginLink() {
    //useHistory() allows you to navigate between different pages
    const history = useHistory();
    async function googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider).then (
            async (result) => {
                const token = await auth?.currentUser?.getIdToken(true);
                if (token) {
                    localStorage.setItem("@token", token);
                    history.push("./");
                }
            },
            function (error) {
                console.log(error);
            }
        );
    }

    return (
        <div>
            <button onClick={googleLogin} className="button">Sign in With Google</button>
        </div>
    );
}