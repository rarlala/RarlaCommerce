import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { CLIENT_ID } from "constants/googleAuth";

export default function Google() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="w-full h-300">
        <GoogleLogin
          onSuccess={({ credential }) => {
            fetch(`/api/auth/sign-up?credential=${credential}`)
              .then((res) => res.json())
              .then((data) => console.log(data));
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
