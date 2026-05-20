const POLLINATIONS_API = "https://gen.pollinations.ai/v1/images/generations";

function detectMimeType(url, contentType) {
  if (contentType && contentType.includes("image/")) return contentType.split(";")[0];

  const cleanUrl = String(url || "").split("?")[0].toLowerCase();

  if (cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) return "image/jpeg";
  if (cleanUrl.endsWith(".webp")) return "image/webp";
  if (cleanUrl.endsWith(".gif")) return "image/gif";

  return "image/png";
}

async function imageUrlToDataUrl(imageUrl, apiKey) {
  const imageResponse = await fetch(imageUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!imageResponse.ok) {
    const errorText = await imageResponse.text();
    throw new Error(`Image fetch failed ${imageResponse.status}: ${errorText}`);
  }

  const contentType = detectMimeType(imageUrl, imageResponse.headers.get("content-type"));
  const arrayBuffer = await imageResponse.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return `data:${contentType};base64,${base64}`;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.POLLINATIONS_API_KEY;

  if (!apiKey) {
    return response.status(500).json({
      error: "Missing POLLINATIONS_API_KEY on server.",
    });
  }

  try {
    const {
      prompt,
      width = 1024,
      height = 1024,
      quality = "high",
    } = request.body || {};

    if (!prompt || typeof prompt !== "string") {
      return response.status(400).json({
        error: "Missing prompt.",
      });
    }

    const pollinationsResponse = await fetch(POLLINATIONS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "zimage",
        prompt,
        width,
        height,
        size: `${width}x${height}`,
        quality,
        n: 1,
        response_format: "url",
        safe: true,
      }),
    });

    const text = await pollinationsResponse.text();

    if (!pollinationsResponse.ok) {
      return response.status(pollinationsResponse.status).json({
        error: "Pollinations API error.",
        details: text,
      });
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return response.status(502).json({
        error: "Pollinations returned invalid JSON.",
        details: text,
      });
    }

    const imageUrl = data?.data?.[0]?.url;

    if (!imageUrl) {
      return response.status(502).json({
        error: "Pollinations did not return an image URL.",
        details: data,
      });
    }

    const dataUrl = await imageUrlToDataUrl(imageUrl, apiKey);

    return response.status(200).json({
      url: dataUrl,
      originalUrl: imageUrl,
      model: "zimage",
    });
  } catch (error) {
    return response.status(500).json({
      error: "Server error.",
      details: error?.message || "Unknown error",
    });
  }
}
