import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Define types locally for the API route (kept in sync with client types)
interface ImageData {
  base64: string;
  mimeType: string;
}

enum GenerationMode {
  PRODUCT_TO_MODEL = "PRODUCT_TO_MODEL",
  MODEL_TO_MODEL = "MODEL_TO_MODEL",
}

enum PoseOption {
  ORIGINAL = "original",
  SELFIE = "selfie",
  STANDING = "standing",
  CASUAL = "casual",
  PROFESSIONAL = "professional",
  WALKING = "walking",
}

enum BackgroundScene {
  ORIGINAL = "original",
  STUDIO = "studio",
  PARTY = "party",
  COFFEE_DATE = "coffee_date",
  RESTAURANT = "restaurant",
  OUTDOOR = "outdoor",
  URBAN = "urban",
}

enum ServiceType {
  CLOTHING = "clothing",
  HAIRSTYLE = "hairstyle",
  NAILS = "nails",
  MAKEUP = "makeup",
}

interface GenerationResult {
  image: string | null;
  text: string | null;
}

const stripDataUri = (value: string) => {
  if (!value) return value;
  const index = value.indexOf("base64,");
  return index >= 0 ? value.slice(index + "base64,".length) : value;
};

const buildPrompt = (
  mode: GenerationMode,
  hasMask: boolean,
  hasLogo: boolean,
  serviceType: ServiceType = ServiceType.CLOTHING,
  stylePrompt?: string,
  fitPrompt?: string,
  pose?: PoseOption,
  background?: BackgroundScene
) => {
  // Determine if this is a beauty service
  const isBeautyService = [
    ServiceType.HAIRSTYLE,
    ServiceType.NAILS,
    ServiceType.MAKEUP,
  ].includes(serviceType);

  // Build pose instruction
  const poseInstruction =
    pose && pose !== PoseOption.ORIGINAL
      ? `\n**Pose Adjustment:** Transform the model's pose to a ${
          pose === PoseOption.SELFIE
            ? "selfie-style angle with a natural, close-up perspective as if taking a self-portrait"
            : pose.replace("_", " ")
        } pose while maintaining their identity${
          isBeautyService ? " and facial features" : " and the garment fit"
        }.`
      : "";

  // Build background instruction
  let backgroundInstruction = "";
  if (background && background !== BackgroundScene.ORIGINAL) {
    const backgroundDescriptions: Record<BackgroundScene, string> = {
      [BackgroundScene.ORIGINAL]: "",
      [BackgroundScene.STUDIO]:
        "professional photography studio with clean backdrop, soft lighting, and minimal shadows",
      [BackgroundScene.PARTY]:
        "vibrant party atmosphere with colorful lights, festive decorations, and social ambiance",
      [BackgroundScene.COFFEE_DATE]:
        "cozy coffee shop interior with warm lighting, wooden furniture, and casual cafe atmosphere",
      [BackgroundScene.RESTAURANT]:
        "elegant restaurant setting with fine dining ambiance, warm lighting, and sophisticated decor",
      [BackgroundScene.OUTDOOR]:
        "natural outdoor environment with soft daylight, greenery, and open space",
      [BackgroundScene.URBAN]:
        "modern urban street scene with city architecture, street elements, and contemporary vibe",
    };

    backgroundInstruction = `\n**Background Scene:** Replace the background with a realistic ${backgroundDescriptions[background]}. Ensure proper lighting consistency and natural integration.`;
  }

  const styleInstructionBlock =
    stylePrompt || fitPrompt
      ? `\n**Style & Fit Guidance:**\n${
          stylePrompt ? `Style inspiration: '${stylePrompt}'. ` : ""
        }${
          fitPrompt ? `Fit preference: '${fitPrompt}'. ` : ""
        }Ensure these directions are reflected realistically.\n`
      : "";

  // Build service-specific instructions
  const getServiceInstructions = () => {
    switch (serviceType) {
      case ServiceType.HAIRSTYLE:
        return {
          productName: "hairstyle",
          preserveInstructions:
            "Preserve the person's facial features, skin tone, face shape, and body exactly.",
          applicationInstructions:
            "Apply the hairstyle naturally, matching the person's head shape, hairline, and style. Ensure realistic hair texture, color, volume, and flow. Blend seamlessly with lighting and shadows.",
        };
      case ServiceType.NAILS:
        return {
          productName: "nail design",
          preserveInstructions:
            "Preserve the person's hands, fingers, skin tone, and overall appearance exactly.",
          applicationInstructions:
            "Apply the nail design to the person's fingernails naturally. Match hand position and lighting. Ensure realistic nail shape, polish texture, and design details.",
        };
      case ServiceType.MAKEUP:
        return {
          productName: "makeup look",
          preserveInstructions:
            "Preserve the person's facial structure, features, skin tone, and hair exactly.",
          applicationInstructions:
            "Apply the makeup look naturally to the person's face. Match skin tone, lighting, and facial contours. Ensure realistic makeup application with proper blending and color matching.",
        };
      case ServiceType.CLOTHING:
      default:
        return {
          productName: "product",
          preserveInstructions:
            "Preserve the model's identity, hair, and facial features exactly.",
          applicationInstructions:
            "Seamlessly match scale, lighting, shadow, and texture.",
        };
    }
  };

  const serviceInstructions = getServiceInstructions();

  switch (mode) {
    case GenerationMode.PRODUCT_TO_MODEL:
      if (hasMask) {
        return `You are a virtual try-on assistant. Combine a ${serviceInstructions.productName} image with a person's photo using the provided mask.\n\nInputs:\n- Image 1: the person's photo\n- Image 2: the ${serviceInstructions.productName} to apply\n- Image 3: the mask defining the application region\n\nInstructions:\n1. Apply the ${serviceInstructions.productName} strictly within the white mask region.\n2. Preserve everything outside the mask exactly as the original photo.\n3. ${serviceInstructions.applicationInstructions}${poseInstruction}${backgroundInstruction}\n${styleInstructionBlock}4. Return only the final edited photo.`;
      }
      return `You are a virtual try-on assistant. Apply the ${
        serviceInstructions.productName
      } onto the person's photo.\n\nInputs:\n- Image 1: the person's photo\n- Image 2: the ${
        serviceInstructions.productName
      } to apply\n\nInstructions:\n1. Identify and isolate the ${
        serviceInstructions.productName
      }.\n2. ${
        isBeautyService
          ? `Apply the ${serviceInstructions.productName} to the appropriate area of the person.`
          : "Replace any similar garment on the model, or add the product naturally."
      }\n3. ${
        serviceInstructions.preserveInstructions
      }${poseInstruction}${backgroundInstruction}\n4. ${
        serviceInstructions.applicationInstructions
      }\n${styleInstructionBlock}5. Return only the final edited photo.`;
    case GenerationMode.MODEL_TO_MODEL:
      if (hasLogo) {
        return `You are an expert fashion retoucher. Swap clothing from a source model onto a target model and apply a logo.\n\nInputs:\n- Image 1: target model\n- Image 2: source model (garment reference)\n- Image 3: logo to apply\n\nInstructions:\n1. Transfer only the garment from the source model.\n2. Preserve the target model's appearance and facial features exactly.${poseInstruction}${backgroundInstruction}\n3. Integrate the garment with realistic draping, lighting, and shadows.\n4. Place the logo naturally on the garment, respecting folds and lighting.\n${styleInstructionBlock}5. Return only the finished target model image.`;
      }
      return `You are an expert fashion retoucher. Swap clothing from a source model onto a target model.\n\nInputs:\n- Image 1: target model\n- Image 2: source model (garment reference)\n\nInstructions:\n1. Transfer only the garment from the source model.\n2. Preserve the target model's appearance and facial features exactly.${poseInstruction}${backgroundInstruction}\n3. Integrate the garment with realistic draping, lighting, and shadows.\n${styleInstructionBlock}4. Return only the finished target model image.`;
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
  serviceType?: ServiceType,
  stylePrompt?: string,
  fitPrompt?: string,
  pose?: PoseOption,
  background?: BackgroundScene
): Promise<GenerationResult> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY – set it in .env or .env.local");
  }

  const prompt = buildPrompt(
    mode,
    Boolean(maskImage),
    Boolean(logoImage),
    serviceType || ServiceType.CLOTHING,
    stylePrompt,
    fitPrompt,
    pose,
    background
  );

  // Build messages with multi-modal content
  const content: Array<
    | { type: "text"; text: string }
    | { type: "image"; image: string; mimeType?: string }
  > = [
    { type: "text", text: prompt },
    {
      type: "image",
      image: targetImage.base64,
      mimeType: targetImage.mimeType,
    },
    {
      type: "image",
      image: sourceImage.base64,
      mimeType: sourceImage.mimeType,
    },
  ];

  if (maskImage) {
    content.push({
      type: "image",
      image: maskImage.base64,
      mimeType: maskImage.mimeType,
    });
  }

  if (logoImage) {
    content.push({
      type: "image",
      image: logoImage.base64,
      mimeType: logoImage.mimeType,
    });
  }

  try {
    // Create Google provider with API key
    const googleProvider = createGoogleGenerativeAI({
      apiKey,
    });

    const result = await generateText({
      model: googleProvider("gemini-2.5-flash-image-preview"),
      messages: [
        {
          role: "user",
          content,
        },
      ],
      abortSignal: AbortSignal.timeout(60000), // 60 second timeout
    });

    // Extract generated images from files
    let imageBase64: string | null = null;
    let outputText: string | null = result.text || null;

    // Check for generated images in the files array
    if (result.files && result.files.length > 0) {
      for (const file of result.files) {
        if (file.mediaType.startsWith("image/")) {
          // file.base64 from AI SDK is already a data URL, but if not, construct it
          if (file.base64.startsWith("data:")) {
            imageBase64 = file.base64;
          } else {
            // Construct proper data URL with mediaType
            imageBase64 = `data:${file.mediaType};base64,${file.base64}`;
          }
          console.log("Image found - mediaType:", file.mediaType);
          console.log("Image base64 preview:", imageBase64?.substring(0, 100));
          break;
        }
      }
    }

    if (!imageBase64) {
      throw new Error("Gemini did not return an image");
    }

    console.log("Returning image to client, length:", imageBase64.length);
    return { image: imageBase64, text: outputText };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
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
      body.serviceType,
      body.stylePrompt,
      body.fitPrompt,
      body.pose,
      body.background
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
