import React, { useState } from "react";
import "./styles.css";
import SignUpForm from "../auth/SignUp";
import SignInForm from "../auth/SignIn"

export default function Auth() {
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
      <img src="/logo.png" alt='Categorizer Logo' style={{maxWidth: '500px', paddingTop: '75px', paddingBottom: '25px'}}/>
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Already Registred?</h1>
              <p>
                To access our services, please Sign In.
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>First time here? </h1>
              <p>Register now, and start your free-trial! </p>
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
