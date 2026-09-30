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

    // Entrega o site normalmente
    return env.ASSETS.fetch(request);
  }
};
