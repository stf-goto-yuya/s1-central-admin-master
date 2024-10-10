import Link from "next/link";
import { signOut } from "../utils/auth";
import Router from "next/router";

interface Props {
  authenticated: boolean;
}

const Header: React.FC<Props> = ({ authenticated }) => {
  const signout = (): void => {
    signOut();
    Router.push("/signin");
  };

  return (
    <header className="bg-gray-900 py-4 px-12 flex justify-between items-center border-b border-gray-800 shadow-lg">
      <section className="">
        <h1 className="text-gray-600">
          <Link href="/">
            <a className="text-gray-600">S1 Central Admin</a>
          </Link>
        </h1>
      </section>
      <section>
        <ul className="flex flex-row">
          {authenticated ? (
            <li>
              <button
                onClick={signout}
                className="text-gray-600 bg-gray-900 border border-gray-800 py-2 px-4 rounded-full"
              >
                サインアウト
              </button>
            </li>
          ) : (
            <li>
              <Link href="/signin">
                <a className="text-gray-600 bg-gray-900 border border-gray-800 py-2 px-4 rounded-full">
                  サインイン
                </a>
              </Link>
            </li>
          )}
        </ul>
      </section>
    </header>
  );
};

export default Header;
