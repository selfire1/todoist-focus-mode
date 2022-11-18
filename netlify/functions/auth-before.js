/* eslint-disable import/extensions */
const { OAuth, getCookie, generateCsrfToken } = require('./util/auth.js');
const providers = require('./util/providers.js');

/* Do initial auth redirect */
exports.handler = async (event) => {
  if (!event.queryStringParameters) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'No token found',
      }),
    };
  }

  const csrfToken = generateCsrfToken();
  const provider = event.queryStringParameters.provider;

  const oauth = new OAuth(provider);
  let config = oauth.config;

  // eslint-disable-next-line max-len
  const redirectUrl = (new URL(event.queryStringParameters.securePath, config.secureHost)).toString();

  /* Generate authorizationURI */
  const authorizationURI = oauth.authorizationCode.authorizeURL({
    redirect_uri: config.redirect_uri,
    /* Specify how your app needs to access the user’s account. */
    scope: providers[provider].scope || '',
    /* State helps mitigate CSRF attacks & Restore the previous state of your app */
    state: `url=${redirectUrl}&csrf=${csrfToken}&provider=${provider}`,
  });

  console.log('[auth-start] SETTING COOKIE');

  /* Redirect user to authorizationURI */
  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': getCookie('_11ty_oauth_csrf', csrfToken, 60 * 2), // 2 minutes
      Location: authorizationURI,
      'Cache-Control': 'no-cache', // Disable caching of this response
    },
    body: '', // return body for local dev
  };
};
