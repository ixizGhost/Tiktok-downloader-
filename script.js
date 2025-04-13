async function resolveShortLink(shortUrl) {
  try {
    const res = await fetch(`https://unshorten.me/json/${encodeURIComponent(shortUrl)}`);
    const data = await res.json();
    return data.resolved_url || null;
  } catch (error) {
    console.error("Gagal resolve shortlink:", error);
    return null;
  }
}

async function downloadVideo() {
  const inputUrl = document.getElementById('tiktok-url').value.trim();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "Loading...";

  if (!inputUrl) {
    resultDiv.innerHTML = "Silakan masukkan URL TikTok.";
    return;
  }

  try {
    const realUrl = inputUrl.includes("vt.tiktok.com")
      ? await resolveShortLink(inputUrl)
      : inputUrl;

    if (!realUrl) {
      resultDiv.innerHTML = "Gagal resolve URL TikTok.";
      return;
    }

    const apiUrl = `https://tiktok-download-without-watermark.p.rapidapi.com/analysis?url=${encodeURIComponent(realUrl)}&hd=0`;

    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'tiktok-download-without-watermark.p.rapidapi.com',
        'x-rapidapi-key': '36bd1cd300msh7b01c4168214e97p1c3535jsn38d1908ca854'
      }
    });

    if (!res.ok) {
      resultDiv.innerHTML = "Gagal menghubungi API TikTok.";
      return;
    }

    const data = await res.json();
    console.log(data);

    // Menyesuaikan struktur respons dari API (ubah jika beda)
    const videoUrl = data?.data?.play || data?.data?.wmplay || data?.data?.nowm;

    if (videoUrl) {
      resultDiv.innerHTML = `
        <video controls width="100%" src="${videoUrl}"></video>
        <br/>
        <a href="${videoUrl}" download>
          <button>Download Video</button>
        </a>
      `;
    } else {
      resultDiv.innerHTML = "Gagal mengambil video.";
    }
  } catch (error) {
    resultDiv.innerHTML = "Terjadi error saat memproses.";
    console.error("Error:", error);
  }
}