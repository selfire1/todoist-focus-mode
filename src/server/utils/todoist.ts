import type { H3Event } from "h3";
import {
  eventHandler,
  createError,
  getQuery,
  getRequestURL,
  sendRedirect,
} from "h3";
import { ofetch } from "ofetch";
import { withQuery } from "ufo";
import { defu } from "defu";
import { useRuntimeConfig } from "#imports";
import type { OAuthConfig } from "#auth-utils";

// https://github.com/Atinux/nuxt-auth-utils

export interface OAuthTodoistConfig {
  /**
   * Todoist OAuth Client ID
   * @default process.env.NUXT_OAUTH_TODOIST_CLIENT_ID
   */
  clientId?: string;
  /**
   * Todoist OAuth Client Secret
   * @default process.env.NUXT_OAUTH_TODOIST_CLIENT_SECRET
   */
  clientSecret?: string;
  /**
   * Todoist OAuth Scope
   * @default []
   * @see https://developer.todoist.com/guides/#step-1-authorization-request:~:text=request%20forgery%20attacks.-,Permission%20scopes,-Name
   * @example 'task:add'
   */
  scope?: string;
  /**
   * Todoist OAuth Authorization URL
   * @default 'https://todoist.com/oauth/authorize'
   */
  authorizationURL?: string;

  /**
   * Todoist OAuth Token URL
   * @default 'https://todoist.com/oauth/access_token'
   */
  tokenURL?: string;
}

export function todoistEventHandler({
  config,
  onSuccess,
  onError,
}: OAuthConfig<OAuthTodoistConfig>) {
  return eventHandler(async (event: H3Event) => {
    // @ts-ignore
    config = defu(config, useRuntimeConfig(event).oauth?.todoist, {
      authorizationURL: "https://todoist.com/oauth/authorize",
      tokenURL: "https://todoist.com/oauth/access_token",
    }) as OAuthTodoistConfig;
    const query = getQuery(event);

    if (query.error) {
      const error = createError({
        statusCode: 401,
        message: `Todoist login failed: ${query.error || "Unknown error"}`,
        data: query,
      });
      if (!onError) throw error;
      return onError(event, error);
    }

    if (!config.clientId || !config.clientSecret) {
      const error = createError({
        statusCode: 500,
        message:
          "Missing NUXT_OAUTH_TODOIST_CLIENT_ID or NUXT_OAUTH_TODOIST_CLIENT_SECRET env variables.",
      });
      if (!onError) throw error;
      return onError(event, error);
    }

    if (!query.code) {
      config.scope = config.scope || "";
      // Redirect to Todoist Oauth page
      const redirectUrl = getRequestURL(event).href;
      return sendRedirect(
        event,
        withQuery(config.authorizationURL as string, {
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope,
        }),
      );
    }

    const tokens: any = await ofetch(config.tokenURL as string, {
      method: "POST",
      body: {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: query.code,
      },
    });

    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Todoist login failed: ${tokens.error || "Unknown error"}`,
        data: tokens,
      });
      if (!onError) throw error;
      return onError(event, error);
    }

    return onSuccess(event, {
      tokens,
    });
  });
}
