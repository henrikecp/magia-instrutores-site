export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Rota de teste da API
    if (url.pathname === "/api/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "Magia Instrutores API"
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Inicia o login/autorização do Google
    if (url.pathname === "/api/google/login") {
      const googleAuthUrl = new URL(
        "https://accounts.google.com/o/oauth2/v2/auth"
      );

      googleAuthUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
      googleAuthUrl.searchParams.set(
        "redirect_uri",
        "https://magiainstrutores.com.br/api/google/callback"
      );
      googleAuthUrl.searchParams.set("response_type", "code");
      googleAuthUrl.searchParams.set(
        "scope",
        "https://www.googleapis.com/auth/business.manage"
      );
      googleAuthUrl.searchParams.set("access_type", "offline");
      googleAuthUrl.searchParams.set("prompt", "consent");

      return Response.redirect(googleAuthUrl.toString(), 302);
    }

    // Recebe a resposta do Google
    if (url.pathname === "/api/google/callback") {
      const code = url.searchParams.get("code");

      if (!code) {
        return new Response(
          JSON.stringify({
            error: "Código de autorização não recebido."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      const tokenResponse = await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri:
              "https://magiainstrutores.com.br/api/google/callback",
            grant_type: "authorization_code"
          })
        }
      );

      const tokens = await tokenResponse.json();

      return new Response(JSON.stringify(tokens, null, 2), {
        status: tokenResponse.ok ? 200 : 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Entrega o site normalmente
    return env.ASSETS.fetch(request);
  }
};
