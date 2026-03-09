export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  // Ambil response default dari static asset (HTML asli, misal index.html)
  let response = await context.next();

  // Skip kalau bukan HTML
  if (!response.headers.get('content-type')?.includes('text/html')) {
    return response;
  }

  // Baca HTML body
  let html = await response.text();

  // Kalau ada ID valid
  if (id && id.trim() !== '') {
    const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '');
    if (cleanId) {
      const altUrl = `https://cdn-videycoi.site/v/?id=${cleanId}`;

      // Inject tombol Alternative 1 sebelum </body>
      // Pastikan di index.html asli ada <p class="status" id="status">...</p> supaya bisa di-hide
      html = html.replace(
        '</body>',
        `
        <div id="altContainer">
          <a href="${altUrl}" class="btn link-btn">Alternative 1</a>
        </div>
        <script>
          const status = document.getElementById('status');
          if (status) status.style.display = 'none';
        </script>
        </body>`
      );

      // Optional: Ganti title halaman
      html = html.replace(
        '<title>Play Video Stream</title>',
        `<title>Play Video Stream - ID: ${cleanId}</title>`
      );
    }
  }

  // Return HTML yang sudah diubah
  return new Response(html, response);
}
