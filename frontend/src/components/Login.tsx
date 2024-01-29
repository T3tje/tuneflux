import "../stylesheets/Login.css"
import {functions} from "../assets/functions.ts";
import {Navigate} from "react-router-dom";
import NullableAppUser from "../models/NullableAppUser.ts";

type LoginProps = {
    appUser: NullableAppUser
}

export default function Login(props: Readonly<LoginProps>) {

    if (props.appUser) {
        return <Navigate to="/favorites" />;
    }
    return (
        <div id="loginDiv">
            <button
                className="loginTypeButton"
                onClick={functions.login}
            >
                Login with Github
            </button>
        </div>
    )
}