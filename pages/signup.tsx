import HomeLayout from "../components/HomeLayout";
import Link from "next/link";
import Router from "next/router";
import { NextPage } from "next";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useState } from "react";
import { authenticate } from "../utils/auth";
import Loader from "../components/Loader";

interface Props {
  authenticated: boolean;
  authToken: string;
}

const SignUp: NextPage<Props> = (props) => {
  if (process.browser && props.authToken) Router.push("/sites");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  const createUser = async () => {
    setError("");
    setAuthenticating(true);
    try {
      const {
        data: { data },
      } = await axios.post(`${process.env.S1_CENTRAL_ENDPOINT}/users`, {
        username,
        password,
      });

      setAuthenticating(false);

      Router.push("/signin");
    } catch (err) {
      switch (err.message) {
        case "Request failed with status code 401":
          setError("ユーザ名かパスワードが違います。");
          break;
        case "Request failed with status code 500":
          setError("ユーザ名が既に登録されてます。");
          break;
        default:
          setError(err.message);
          break;
      }

      if (err.response.data.error) {
        switch (err.response.data.error) {
          case "Path `username` is required.":
            setError("ユーザ名は必須入力です");
            break;
          default:
            break;
        }
      }

      setAuthenticating(false);
    }
  };

  return (
    <>
      {props.authenticated ? (
        <Loader />
      ) : (
        <HomeLayout>
          <section className="relative">
            <div className="absolute bg-gray-900 opacity-75 w-full h-full"></div>
            <section className="absolute bg-transparent w-full h-full flex flex-col justify-center items-center">
              <section className="bg-gray-900 py-4 px-8 border border-gray-800 w-full md:w-1/2 xl:w-1/4 mb-4">
                <h1 className="text-gray-600 text-center uppercase">
                  サインアップ
                </h1>
              </section>
              <section className="bg-gray-900 p-8 pb-12 border border-gray-800 w-full md:w-1/2 xl:w-1/4 flex flex-col">
                <>
                  {error && (
                    <section className="bg-red-300 py-2 px-4 text-red-700 mb-4 text-sm">
                      {error}
                    </section>
                  )}
                </>
                <label
                  htmlFor="username"
                  className="text-gray-300 text-sm font-bold mb-4"
                >
                  ユーザ名
                </label>
                <input
                  className="py-2 px-4 bg-gray-800 focus:outline text-white mb-4 text-sm"
                  name="username"
                  placeholder="ユーザ名を入力してください"
                  onChange={(ev) => setUsername(ev.target.value)}
                />
                <label
                  htmlFor="password"
                  className="text-gray-300 text-sm font-bold mb-4"
                >
                  パスワード
                </label>
                <input
                  className="py-2 px-4 bg-gray-800 focus:outline text-white mb-4 mb-6 text-sm"
                  name="password"
                  type="password"
                  placeholder="パスワードを入力してください"
                  onChange={(ev) => setPassword(ev.target.value)}
                />
                {authenticating ? (
                  <div className="bg-gray-800 py-2 px-4 text-white uppercase mb-4">
                    認証中...
                  </div>
                ) : (
                  <button
                    className="bg-gray-800 py-2 text-white uppercase mb-4 text-sm"
                    onClick={createUser}
                  >
                    サインアップ
                  </button>
                )}

                <Link href="/signin">
                  <a className="text-sm text-gray-600 underline">
                    サインインはこちら
                  </a>
                </Link>
              </section>
            </section>
            <img
              className="w-full object-cover"
              style={{ height: "94vh" }}
              src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
            ></img>
          </section>
        </HomeLayout>
      )}
    </>
  );
};

SignUp.getInitialProps = async function (context) {
  const { authenticated, authToken } = authenticate(context);

  return {
    authToken,
    authenticated,
  };
};

export default SignUp;
