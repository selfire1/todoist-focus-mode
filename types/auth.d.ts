declare module "#auth-utils" {
  interface User {
    access_token: string;
    token_type: string;
  }

  interface UserSession {
    // Add your own fields
  }
}

export {};
