export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    if (pathParts[1]) {
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/hwfilm23/databases/(default)/documents/encurta/link`;
      const response = await fetch(firestoreUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return new Response('Error fetching data from Firestore', { status: response.status });
      }

      const data = await response.json();
      let pageUrl = null;

      for (const category in data.fields) {
        const link = data.fields[category].mapValue.fields;
        if (link[pathParts[1]]) {
          pageUrl = link[pathParts[1]].mapValue.fields.url.stringValue;
          break;
        }
      }

      // Se a URL do vídeo for encontrada, redireciona
      if (pageUrl) {
        return Response.redirect(pageUrl, 302);
      } else {
        return new Response(null, 403);
      } 
    }
    
    }
  }
};
