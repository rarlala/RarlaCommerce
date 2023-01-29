import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function Google() {
  return (
    <GoogleOAuthProvider clientId={String(process.env.NEXT_PUBLIC_CLIENT_ID)}>
      <div className="w-full h-300">
        <GoogleLogin
          onSuccess={({ credential }) => {
            fetch(`/api/auth/sign-up?credential=${credential}`)
              .then((res) => res.json())
              .then((data) => console.log(data));
          }}
          onError={() => {
            console.error("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
