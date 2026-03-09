export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  let response;
  try {
    response = await context.next();
  } catch (e) {
    console.error("Error fetching next:", e);
    return new Response("Server Error", { status: 500 });
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('text/html')) {
    return response;
  }

  let html = await response.text();

  if (id && id.trim() !== '') {
    const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '');
    if (cleanId) {
      const altUrl = `https://cdn-videycoi.site/v/?id=${cleanId}`;

      // Inject tombol Alternative 1 **tepat setelah tombol Watch Video Instantly**
      // Cari tombol pertama dan tambahkan di bawahnya (agar tetap di dalam .container)
      html = html.replace(
        /<a href="https:\/\/conductivebreeds\.com\/hfsryann\?key=eaab76900c74fd3d16fe1e0ef86fffaf" class="btn link-btn">Watch Video Instantly<\/a>/,
        `<a href="https://conductivebreeds.com/hfsryann?key=eaab76900c74fd3d16fe1e0ef86fffaf" class="btn link-btn">Watch Video Instantly</a>

        <div id="altContainer">
          <a href="${altUrl}" class="btn link-btn">Alternative 1</a>
        </div>`
      );

      // Hide status (replace langsung agar aman)
      html = html.replace(
        /<p class="status" id="status"[^>]*>/g,
        '<p class="status" id="status" style="display:none;">'
      );

      // Optional: Ganti title
      html = html.replace(
        /<title>.*?<\/title>/,
        `<title>Watch HD Videos - ${cleanId}</title>`
      );
    }
  }

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
