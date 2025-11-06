// Define types locally for the API route (kept in sync with client types)
interface ImageData {
  base64: string;
  mimeType: string;
}

enum GenerationMode {
  PRODUCT_TO_MODEL = "PRODUCT_TO_MODEL",
  MODEL_TO_MODEL = "MODEL_TO_MODEL",
}

interface GenerationResult {
  image: string | null;
  text: string | null;
}

const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image-preview";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta";

const stripDataUri = (value: string) => {
  if (!value) return value;
  const index = value.indexOf("base64,");
  return index >= 0 ? value.slice(index + "base64,".length) : value;
};

const buildPrompt = (
  mode: GenerationMode,
  hasMask: boolean,
  hasLogo: boolean,
  stylePrompt?: string,
  fitPrompt?: string
) => {
  const styleInstructionBlock =
    stylePrompt || fitPrompt
      ? `\n**Style & Fit Guidance:**\n${
          stylePrompt ? `Style inspiration: '${stylePrompt}'. ` : ""
        }${
          fitPrompt ? `Fit preference: '${fitPrompt}'. ` : ""
        }Ensure these directions are reflected realistically.\n`
      : "";

  switch (mode) {
    case GenerationMode.PRODUCT_TO_MODEL:
      if (hasMask) {
        return `You are a virtual try-on assistant. Combine a product image with a model using the provided mask.\n\nInputs:\n- Image 1: the model photo\n- Image 2: the product to apply\n- Image 3: the mask defining the application region\n\nInstructions:\n1. Apply the product strictly within the white mask region.\n2. Preserve everything outside the mask exactly as the original model photo.\n3. Seamlessly blend scale, lighting, shadow, and texture.\n${styleInstructionBlock}4. Return only the final edited model image.`;
      }
      return `You are a virtual try-on assistant. Place the product onto the model photo.\n\nInputs:\n- Image 1: the model photo\n- Image 2: the product to apply\n\nInstructions:\n1. Identify and isolate the product.\n2. Replace any similar garment on the model, or add the product naturally.\n3. Preserve the model's identity, pose, hair, and background.\n4. Seamlessly match scale, lighting, shadow, and texture.\n${styleInstructionBlock}5. Return only the final edited model image.`;
    case GenerationMode.MODEL_TO_MODEL:
      if (hasLogo) {
        return `You are an expert fashion retoucher. Swap clothing from a source model onto a target model and apply a logo.\n\nInputs:\n- Image 1: target model\n- Image 2: source model (garment reference)\n- Image 3: logo to apply\n\nInstructions:\n1. Transfer only the garment from the source model.\n2. Preserve the target model's appearance, pose, and background exactly.\n3. Integrate the garment with realistic draping, lighting, and shadows.\n4. Place the logo naturally on the garment, respecting folds and lighting.\n${styleInstructionBlock}5. Return only the finished target model image.`;
      }
      return `You are an expert fashion retoucher. Swap clothing from a source model onto a target model.\n\nInputs:\n- Image 1: target model\n- Image 2: source model (garment reference)\n\nInstructions:\n1. Transfer only the garment from the source model.\n2. Preserve the target model's appearance, pose, and background exactly.\n3. Integrate the garment with realistic draping, lighting, and shadows.\n${styleInstructionBlock}4. Return only the finished target model image.`;
    default:
      throw new Error("Unsupported generation mode");
  }
};

const generateStyledImage = async (
  targetImage: ImageData,
  sourceImage: ImageData,
  mode: GenerationMode,
  logoImage?: ImageData | null,
  maskImage?: ImageData | null,
  stylePrompt?: string,
  fitPrompt?: string
): Promise<GenerationResult> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY – set it in .env or .env.local");
  }

  const prompt = buildPrompt(
    mode,
    Boolean(maskImage),
    Boolean(logoImage),
    stylePrompt,
    fitPrompt
  );

  const parts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [
    { text: prompt },
    {
      inlineData: {
        mimeType: targetImage.mimeType,
        data: stripDataUri(targetImage.base64),
      },
    },
    {
      inlineData: {
        mimeType: sourceImage.mimeType,
        data: stripDataUri(sourceImage.base64),
      },
    },
  ];

  if (maskImage) {
    parts.push({
      inlineData: {
        mimeType: maskImage.mimeType,
        data: stripDataUri(maskImage.base64),
      },
    });
  }

  if (logoImage) {
    parts.push({
      inlineData: {
        mimeType: logoImage.mimeType,
        data: stripDataUri(logoImage.base64),
      },
    });
  }

  const body = {
    contents: [
      {
        role: "user",
        parts,
      },
    ],
    responseModalities: ["IMAGE", "TEXT"],
  };

  const url = `${GEMINI_ENDPOINT}/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    const message = errorPayload?.error?.message || response.statusText;
    throw new Error(`Gemini request failed: ${message}`);
  }

  const json = await response.json();
  const candidates = json?.candidates ?? [];
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error("Gemini did not return any candidates");
  }

  let imageBase64: string | null = null;
  let outputText: string | null = null;

  for (const candidate of candidates) {
    const partsList = candidate?.content?.parts ?? [];
    for (const part of partsList) {
      if (part?.inlineData?.mimeType?.startsWith("image/")) {
        imageBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      if (typeof part?.text === "string" && part.text.trim().length > 0) {
        outputText = part.text.trim();
      }
    }
  }

  if (!imageBase64) {
    throw new Error("Gemini did not return an image");
  }

  return { image: imageBase64, text: outputText };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await generateStyledImage(
      body.targetImage,
      body.sourceImage,
      body.mode,
      body.logoImage,
      body.maskImage,
      body.stylePrompt,
      body.fitPrompt
    );

    return Response.json(result);
  } catch (error) {
    console.error("Virtual try-on API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
