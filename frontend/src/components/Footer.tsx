import "../stylesheets/Footer.css"
import {functions} from "../assets/functions.ts";
import {Link} from "react-router-dom";
import React, {SetStateAction} from "react";
import NullableAppUser from "../models/NullableAppUser.ts";

type FooterProps = {
    appUser:NullableAppUser,
    setAppUser: React.Dispatch<SetStateAction<NullableAppUser>>
}
export default function Footer(props: Readonly<FooterProps>) {

    return (
        <>
            {props.appUser ? (
                <div id="footer">
                    <p className="loginName">{props.appUser?.username}</p>
                    <button
                        className="footerButton"
                        onClick={() => functions.logout(props.setAppUser)}
                    >
                        logout
                    </button>
                </div>
            ) : (
                <Link id="footer" to="/login">
                    <button className="footerButton">login</button>
                </Link>
            )}
        </>
    );
}


