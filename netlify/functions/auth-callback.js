const cookie = require("cookie");
const querystring = require("querystring");
const { OAuth, tokens, getCookie } = require("./util/auth.js");

// Function to handle netlify auth callback
exports.handler = async (event, context) => {
  // Exit early
  if (!event.queryStringParameters) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Not authorized',
      })
    }
  }

  // Grant the grant code
  const code = event.queryStringParameters.code;

  // state helps mitigate CSRF attacks & Restore the previous state of your app
  const state = querystring.parse(event.queryStringParameters.state);

  try {
    // console.log("[auth-callback] Cookies", event.headers.cookie);
    let cookies = cookie.parse(event.headers.cookie);
    if (cookies._11ty_oauth_csrf !== state.csrf) {
      throw new Error("Missing or invalid CSRF token.");
    }

    let oauth = new OAuth(state.provider);
    let config = oauth.config;

    // Take the grant code and exchange for an accessToken
    const accessToken = await oauth.authorizationCode.getToken({
      code: code,
      redirect_uri: config.redirect_uri,
      client_id: config.clientId,
      client_secret: config.clientSecret
    });

    const token = accessToken.token.access_token;

    // console.log("[auth-callback]", { token });

    // The noop key here is to workaround Netlify keeping query params on redirects
    // https://answers.netlify.com/t/changes-to-redirects-with-query-string-parameters-are-coming/23436/11
    const URI = `${state.url}?sort=prio:desc`;
    // console.log("[auth-callback]", { URI });

    /* Redirect user to authorizationURI */
    return {
      statusCode: 302,
      headers: {
        Location: URI,
        'Cache-Control': 'no-cache' // Disable caching of this response
      },
      multiValueHeaders: {
        'Set-Cookie': [
          // This cookie *must* be HttpOnly
          getCookie("_11ty_oauth_token", tokens.encode(token), oauth.config.sessionExpiration),
          getCookie("_11ty_oauth_provider", state.provider, oauth.config.sessionExpiration),
          getCookie("_11ty_oauth_csrf", "", -1),
        ]
      },
      body: '' // return body for local dev
    }

  } catch (e) {
    console.log("[auth-callback]", 'Access Token Error', e.message);
    console.log("[auth-callback]", e);
    return {
      statusCode: e.statusCode || 500,
      body: JSON.stringify({
        error: e.message,
      })
    }
  }
}
