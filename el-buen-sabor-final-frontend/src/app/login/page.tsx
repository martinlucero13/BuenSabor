"use client";

import { signIn, useSession } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";

function Login() {
  const { data: session } = useSession();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" }); 
  };


  return (
    <div>
        <div>
        <img
            src="/login-icon.svg"
            alt="login-icon"
        />
        </div>
        <div>Login</div>
        <div>
            <div>
                <img
                src="/username-icon.svg"
                alt="username-icon"/>
            </div>
            <input
                type="text"
                placeholder="Username"
            />
        </div>
        <div>
            <div>
                <img
                src="/password-icon.svg"
                alt="password-icon"
                />
            </div>
            <input
                type="password"
                placeholder="Password"
            />
        </div>
        <div>
            <div>
                <a href="#">Forgot your password?</a>
            </div>
        </div>
        <div>
            Login
        </div>
        <div>
            <div>Don't have an account?</div>
            <a href="#">Register</a>
        </div>
        <div>
        <div>
            <span>or</span>
        </div>
        </div>
        <div>
            <img
                src="google-icon.svg"
                alt="google-icon"
            />
            <Button
                type="button" className="btn btn-primary"
                onClick={handleGoogleSignIn}
                
                >
                Sign In with Google
            </Button>
        </div>
    </div>
  );
}

export default Login;
