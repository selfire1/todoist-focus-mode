const { AuthorizationCode } = require('simple-oauth2');
const cookie = require("cookie");
const fetch = require('node-fetch');

// Warning: process.env.DEPLOY_PRIME_URL won’t work in a Netlify function here.
const SITE_URL = process.env.URL || 'http://localhost:8888';

const providers = require('./providers.js');

class OAuth {
  constructor(provider) {
    this.provider = provider;

    let config = this.config;
    this.authorizationCode = new AuthorizationCode({
      client: {
        id: config.clientId,
        secret: config.clientSecret
      },
      auth: {
        tokenHost: config.tokenHost,
        tokenPath: config.tokenPath,
        authorizePath: config.authorizePath
      }
    });
  }

  get config() {
    const cfg = {
      secureHost: SITE_URL,
      sessionExpiration: 60 * 60 * 8, // in seconds, this is 8 hours

      /* redirect_uri is the callback url after successful signin */
      redirect_uri: `${SITE_URL}/.netlify/functions/auth-callback`,
    }

    if (this.provider === "netlify") {
      Object.assign(cfg, providers.netlify);
    } else if (this.provider === "github") {
      Object.assign(cfg, providers.github);
    } else if (this.provider === "gitlab") {
      Object.assign(cfg, providers.gitlab);
    } else if (this.provider === "slack") {
      Object.assign(cfg, providers.slack);
    } else if (this.provider === "linkedin") {
      Object.assign(cfg, providers.linkedin);
    } else if (this.provider === "todoist") {
      Object.assign(cfg, providers.todoist);
    } else {
      throw new Error("Invalid provider passed to OAuth. Currently only `netlify`, `github`, `gitlab`, `slack` or `linkedin` are supported.")
    }

    cfg.clientId = process.env[cfg.clientIdKey];
    cfg.clientSecret = process.env[cfg.clientSecretKey];

    if (!cfg.clientId || !cfg.clientSecret) {
      throw new Error(`MISSING REQUIRED ENV VARS. ${cfg.clientIdKey} and ${cfg.clientSecretKey} are required.`)
    }

    return cfg;
  }

  async getUser(token, link = this.config.userApi) {
    if (!token) {
      throw new Error("Missing authorization token.");
    }

    const response = await fetch(link, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    console.log("[auth] getUser response status", response.status);
    if (response.status !== 200) {
      throw new Error(`Error ${await response.text()}`);
    }

    const data = await response.json();
    return data;
  }
}

function getCookie(name, value, expiration) {
  let options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: '/',
    maxAge: expiration,
  };

  // no strict cookies on localhost for local dev
  if (SITE_URL.startsWith("http://localhost:8888")) {
    delete options.sameSite;
  }

  return cookie.serialize(name, value, options);
}

function generateCsrfToken() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8) // eslint-disable-line
    return v.toString(16)
  })
}

module.exports = {
  OAuth,
  tokens: {
    encode: function (token) {
      return Buffer.from(token, "utf8").toString("base64");
    },
    decode: function (token) {
      return Buffer.from(token, "base64").toString("utf8");
    }
  },
  getCookie,
  generateCsrfToken,
}
