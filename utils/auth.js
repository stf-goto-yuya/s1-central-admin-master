import { Cookies } from "react-cookie";
import jwt from "jsonwebtoken";
import moment from "moment";

const cookies = new Cookies();

const authenticate = (ctx) => {
  let authToken = null;
  let authenticated = false;

  if (ctx.req) {
    if (ctx.req.headers.cookie) {
      authToken = ctx.req.headers.cookie.replace(
        /(?:(?:^|.*;\s*)_authToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
    }
  } else {
    authToken = cookies.get("_authToken");
  }

  if (authToken) {
    try {
      const { exp } = jwt.verify(authToken, "secretKey");
      const isExpired = moment.unix(exp).isBefore(moment());

      if (isExpired) {
        authenticated = false;
        cookies.remove("_authToken", { domain: process.env.DOMAIN, path: "/" });
      } else {
        authenticated = true;
      }
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        cookies.remove("_authToken", { domain: process.env.DOMAIN, path: "/" });
        authenticated = false;
      }
    }
  }

  return {
    authenticated,
    authToken,
  };
};

const signOut = () => {
  cookies.remove("_authToken", { domain: process.env.DOMAIN, path: "/" });
};

export { authenticate, signOut };
