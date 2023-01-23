import { signIn } from "next-auth/react";
import { FormEventHandler, useState } from "react";

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({ name: "", password: "" });
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    // validate your userinfo
    e.preventDefault();

    const res = await signIn("Credentials", {
      name: userInfo.name,
      password: userInfo.password,
    });
  };
  return (
    <div className="sign-in-form">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          value={userInfo.name}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, name: target.value })
          }
          type="text"
          placeholder="john"
        />
        <input
          value={userInfo.password}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, password: target.value })
          }
          type="password"
          placeholder="********"
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default SignIn;
