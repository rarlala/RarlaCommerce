import { GoogleLogin } from "@react-oauth/google";

export default function Google() {
  return (
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
  );
}