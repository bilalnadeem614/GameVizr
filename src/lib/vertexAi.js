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
    } catch (jsonError) {
      // Fallback: Parsing failed (likely due to single quotes or formatted whitespace).
      // Try to parse as a relaxed JavaScript object.
      try {
        // Remove line breaks which can break 'new Function' string literals unless escaped
        const sanitized = process.env.GOOGLE_SERVICE_ACCOUNT_JSON.replace(/(?<!\\)\n/g, " ");
        const parseRelaxedJSON = (str) => new Function(`return ${str}`)();
        options.credentials = parseRelaxedJSON(sanitized);
      } catch (jsError) {
        console.error("Vertex AI: Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON environment variable.");
        // Only log errors if we can't fallback to file
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
           console.error("JSON Error:", jsonError.message);
           console.error("Relaxed Parser Error:", jsError.message);
        }
      }
    }
  }

  // Common fix used for some hosting envs: ensure the private key has correct newlines
  if (options.credentials && options.credentials.private_key) {
    let key = options.credentials.private_key;
    // Fix literal string newlines "\n" -> real newline
    key = key.replace(/\\n/g, "\n");
    
    // Fix if key got flattened to a single line without header breaks
    if (key.includes("-----BEGIN PRIVATE KEY-----") && !key.includes("-----BEGIN PRIVATE KEY-----\n")) {
       key = key.replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n");
    }
    if (key.includes("-----END PRIVATE KEY-----") && !key.includes("\n-----END PRIVATE KEY-----")) {
       key = key.replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----");
    }
    options.credentials.private_key = key;
  }

  if (!options.credentials) {
    // Local development fallback: use the file path
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
