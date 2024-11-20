export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');

    // Verifica se há um identificador no caminho
    if (pathParts[1]) {
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/hwfilm23/databases/(default)/documents/encurta/link`;

      try {
        const response = await fetch(firestoreUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Verifica se o Firestore retornou uma resposta válida
        if (!response.ok) {
          return new Response('Error fetching data from Firestore', { status: response.status });
        }

        const data = await response.json();

        // Tenta encontrar o link correspondente ao identificador
        const shortLink = pathParts[1];
        if (data.fields && data.fields[shortLink]) {
          const pageUrl = data.fields[shortLink].mapValue.fields.url.stringValue;

          // Redireciona para a URL encontrada
          return Response.redirect(pageUrl, 302);
        } else {
          // Retorna 404 se o link não foi encontrado
          return new Response(null, { status: 404 });
        }
      } catch (error) {
        // Trata erros inesperados
        return new Response(`Unexpected error: ${error.message}`, { status: 500 });
      }
    }

    // Responde com 400 se a URL não contiver um identificador válido
    return new Response(null, { status: 400 });
  }
};
