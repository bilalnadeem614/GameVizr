import { GoogleAuth } from "google-auth-library";

const SCOPE = "https://www.googleapis.com/auth/cloud-platform";

function getBaseUrl(location) {
  if (!location || location === "global") {
    return "https://aiplatform.googleapis.com";
  }
  return `https://${location}-aiplatform.googleapis.com`;
}

export async function callGenerateContent({ model, contents, generationConfig }) {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || "global";

  if (!project) {
    throw new Error("Missing GOOGLE_CLOUD_PROJECT environment variable.");
  }
  if (!model) {
    throw new Error("Missing model name.");
  }

  const options = {
    scopes: [SCOPE],
  };

  // For deployment: use the JSON content from an environment variable
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      options.credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    } catch (error) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON", error);
    }
  } else {
    // Local development: fallback to the file path
    options.keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }

  const auth = new GoogleAuth(options);

  const accessToken = await auth.getAccessToken();
  const baseUrl = getBaseUrl(location);
  const url = `${baseUrl}/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ contents, generationConfig }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Vertex AI error ${response.status}: ${text}`);
  }

  return response.json();
}

export function extractText(result) {
  const parts = result?.candidates?.[0]?.content?.parts || [];
  return parts.map((part) => part.text).filter(Boolean).join("");
}

export function extractInlineImage(result) {
  const parts = result?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part?.inlineData?.data) {
      return {
        data: part.inlineData.data,
        mimeType: part.inlineData.mimeType || "application/octet-stream",
      };
    }
  }
  return null;
}
