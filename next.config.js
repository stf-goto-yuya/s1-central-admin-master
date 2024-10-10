require("dotenv").config();

module.exports = {
  env: {
    S1_CENTRAL_ENDPOINT: process.env.S1_CENTRAL_ENDPOINT,
    SLACK_API_ENDPOINT: process.env.SLACK_API_ENDPOINT,
    DOMAIN: process.env.DOMAIN,
    SECRET: process.env.SECRET,
    INITIAL_ADMINS: process.env.INITIAL_ADMINS,
  },
};
