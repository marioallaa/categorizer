import React from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../fire/init.js"; 
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom"; 

function SignInForm() {
  const [state, setState] = React.useState({
    email: "",
    password: ""
  });
  const [resetPassword, setResetPassword] = React.useState(false);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const navigate = useNavigate();

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    
    if (resetPassword) {
      try {
        await sendPasswordResetEmail(auth, state.email);
        toast.success('Password reset email sent!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setState({ email: "", password: "" });
        setResetPassword(false);
      } catch (error) {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      const { email, password } = state;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast.success(`Successfully signed in as: ${userCredential.user.email}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setState({ email: "", password: "" });
        navigate("/");
      } catch (error) {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const handleResetPasswordClick = () => {
    setResetPassword(!resetPassword);
    setState({ ...state, password: "" }); 
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>{resetPassword ? "Reset Password" : "Sign In"}</h1>
        <span style={{ marginTop: "32px" }}></span>
        <input
          style={{ borderRadius: "12px" }}
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
          required
        />
        {!resetPassword && (
          <input
            style={{ borderRadius: "12px" }}
            type="password"
            name="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
            required
          />
        )}
        <a style={{cursor: 'pointer', color: '#0013be'}} onClick={handleResetPasswordClick}>
          {resetPassword ? "Go back to sign in!" : "Forgot your password?"}
        </a>
        <button style={{ marginTop: "32px" }} type="submit">
          {resetPassword ? "Reset Password" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default SignInForm;
