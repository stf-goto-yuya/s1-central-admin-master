import HomeLayout from "../components/HomeLayout";
import Link from "next/link";
import { authenticate } from "../utils/auth";
import Router from "next/router";
import Loader from "../components/Loader";
import { NextPage } from "next";

interface Props {
  authToken: string;
  authenticated: boolean;
}

const Home: NextPage<Props> = (props) => {
  if (process.browser && props.authToken) Router.push("/sites");

  return (
    <>
      {props.authenticated ? (
        <Loader />
      ) : (
        <HomeLayout>
          <section className="relative">
            <div className="absolute bg-gray-900 opacity-75 w-full h-full"></div>
            <div className="absolute bg-transparent w-full h-full flex flex-col justify-center items-center">
              <h1 className="text-white text-lg md:text-3xl mb-8 border border-white py-2 px-4 rounded">
                S1 Central Admin
              </h1>
              <Link href="/signin">
                <a className="bg-gray-900 text-sm md:text-lg text-gray-300 py-2 px-4 uppercase rounded">
                  サインインする
                </a>
              </Link>
            </div>
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

Home.getInitialProps = async function (context) {
  const { authenticated, authToken } = authenticate(context);

  return {
    authToken,
    authenticated,
  };
};

export default Home;
