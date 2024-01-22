import "../stylesheets/Login.css"
import {functions} from "../assets/functions.ts";
export default function Login() {

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