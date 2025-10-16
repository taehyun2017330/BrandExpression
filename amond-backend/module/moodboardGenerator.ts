import OpenAI from 'openai';
import sharp from 'sharp';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
});

interface MoodboardInput {
  visualStyle: string;      // "모던하고 세련된 스타일"
  colorPalette: string[];   // ["빨강", "파랑", "노랑"]
  brandAnalysis: string;    // "혁신적이고 독창적인 브랜드입니다"
  category: string;         // "뷰티/미용"
}

/**
 * Generate a creative moodboard as a 2x2 collage of images
 * Returns base64 encoded combined image (no S3 upload)
 */
export async function generateMoodboard(input: MoodboardInput): Promise<string> {
  console.log('🎨 [Moodboard] Starting moodboard generation...');

  try {
    // Define 4 different prompt themes for diversity
    const themes = [
      `Abstract color composition representing ${input.visualStyle} with colors: ${input.colorPalette.join(', ')}. Minimalist, artistic, no text, no people.`,
      `Mood and atmosphere visual for ${input.category} brand that is ${input.brandAnalysis}. Abstract artistic style, ${input.visualStyle}, no text.`,
      `Texture and pattern design in style of ${input.visualStyle} using color palette: ${input.colorPalette.join(', ')}. Clean, professional, abstract, no text.`,
      `Brand essence visualization: ${input.brandAnalysis}. Visual style: ${input.visualStyle}. Colors: ${input.colorPalette[0]}, ${input.colorPalette[1]}. No text, artistic.`
    ];

    // Generate 4 images in parallel
    console.log('🎨 [Moodboard] Generating 4 images in parallel...');
    const imagePromises = themes.map(async (prompt, index) => {
      console.log(`🎨 [Moodboard] Generating image ${index + 1}/4...`);
      const response = await client.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        quality: "medium",
        size: "1024x1024"
        // Note: gpt-image-1 automatically returns b64_json, no response_format parameter needed
      });

      if (!response?.data?.[0]?.b64_json) {
        throw new Error(`Image ${index + 1} generation failed - no b64_json in response`);
      }

      const imageBuffer = Buffer.from(response.data[0].b64_json, "base64");
      console.log(`✅ [Moodboard] Image ${index + 1}/4 generated (${imageBuffer.length} bytes)`);
      return imageBuffer;
    });

    const imageBuffers = await Promise.all(imagePromises);
    console.log('✅ [Moodboard] All 4 images generated successfully');

    // Resize each image to 512x512 for the collage
    console.log('🔧 [Moodboard] Resizing images to 512x512...');
    const resizedImages = await Promise.all(
      imageBuffers.map(buffer =>
        sharp(buffer)
          .resize(512, 512, { fit: 'cover' })
          .toBuffer()
      )
    );

    // Create 2x2 collage (1024x1024 final size)
    console.log('🎨 [Moodboard] Creating 2x2 collage...');
    const collage = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      { input: resizedImages[0], top: 0, left: 0 },      // Top-left
      { input: resizedImages[1], top: 0, left: 512 },    // Top-right
      { input: resizedImages[2], top: 512, left: 0 },    // Bottom-left
      { input: resizedImages[3], top: 512, left: 512 }   // Bottom-right
    ])
    .png()
    .toBuffer();

    // Convert to base64
    const base64Image = `data:image/png;base64,${collage.toString('base64')}`;
    console.log('✅ [Moodboard] Collage created successfully');

    return base64Image;

  } catch (error) {
    console.error('❌ [Moodboard] Error generating moodboard:', error);
    throw new Error('무드보드 생성 중 오류가 발생했습니다.');
  }
}

/**
 * Generate moodboard with optional caching
 */
export async function generateMoodboardWithCache(
  input: MoodboardInput,
  cacheKey?: string
): Promise<{ moodboard: string; cached: boolean }> {
  // For now, no caching - just generate fresh
  // TODO: Implement Redis caching if needed
  const moodboard = await generateMoodboard(input);
  return { moodboard, cached: false };
}
