import sharp from 'sharp';

/**
 * Compress base64 image
 * @param {string} base64String - Base64 encoded image string
 * @param {number} maxWidth - Maximum width (default: 1200)
 * @param {number} maxHeight - Maximum height (default: 1200)
 * @param {number} quality - JPEG quality 0-100 (default: 80)
 * @returns {Promise<string>} - Compressed base64 string
 */
export const compressBase64Image = async (base64String, maxWidth = 800, maxHeight = 800, quality = 70) => {
  try {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const originalSize = imageBuffer.length;
    
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    let width = metadata.width;
    let height = metadata.height;
    
    console.log(`📸 Original image: ${width}x${height}, size: ${(originalSize / 1024).toFixed(2)}KB`);
    
    // Calculate new dimensions while maintaining aspect ratio
    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height;
      
      if (width > height) {
        if (width > maxWidth) {
          width = maxWidth;
          height = Math.round(width / aspectRatio);
        }
      } else {
        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(height * aspectRatio);
        }
      }
    }
    
    // Compress and resize image
    const compressedBuffer = await sharp(imageBuffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality,
        mozjpeg: true // Better compression
      })
      .toBuffer();
    
    const compressedSize = compressedBuffer.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    console.log(`✅ Compressed image: ${width}x${height}, size: ${(compressedSize / 1024).toFixed(2)}KB (${compressionRatio}% reduction)`);
    
    // Convert back to base64
    const compressedBase64 = compressedBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    
    return `data:${mimeType};base64,${compressedBase64}`;
  } catch (error) {
    console.error('❌ Error compressing image:', error);
    // Return original if compression fails
    return base64String;
  }
};

/**
 * Compress array of base64 images
 * @param {string[]} base64Images - Array of base64 encoded image strings
 * @param {number} maxWidth - Maximum width (default: 1200)
 * @param {number} maxHeight - Maximum height (default: 1200)
 * @param {number} quality - JPEG quality 0-100 (default: 80)
 * @returns {Promise<string[]>} - Array of compressed base64 strings
 */
export const compressBase64Images = async (base64Images, maxWidth = 800, maxHeight = 800, quality = 70) => {
  if (!Array.isArray(base64Images) || base64Images.length === 0) {
    return base64Images;
  }
  
  try {
    const compressedImages = await Promise.all(
      base64Images.map(image => compressBase64Image(image, maxWidth, maxHeight, quality))
    );
    return compressedImages;
  } catch (error) {
    console.error('Error compressing images array:', error);
    return base64Images;
  }
};

