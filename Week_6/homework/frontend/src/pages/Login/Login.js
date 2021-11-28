
import { Fragment } from "react";
import LoginLink from "../../components/Login/Login";
import "./style.css";

export default function Login(props) {
    
    return (
        <Fragment>
          <h1>Click below to sign up or login with Google!</h1>
            <LoginLink />
        </Fragment>
      );
}


