// Add this validation to your frontend before sending to brand-summary

const MAX_TOTAL_SIZE = 80 * 1024 * 1024; // 80MB (leaving 20MB buffer)
const MAX_IMAGES = 20;

function validateImageUpload(selectedImages) {
  // Check image count
  if (selectedImages.length > MAX_IMAGES) {
    alert(`최대 ${MAX_IMAGES}개의 이미지만 선택할 수 있습니다.`);
    return false;
  }
  
  // Calculate total size
  let totalSize = 0;
  selectedImages.forEach(img => {
    if (img.base64) {
      // Base64 size in bytes
      totalSize += img.base64.length;
    }
  });
  
  if (totalSize > MAX_TOTAL_SIZE) {
    const sizeMB = (totalSize / 1024 / 1024).toFixed(1);
    alert(`이미지 총 크기가 너무 큽니다 (${sizeMB}MB). 일부 이미지를 제거해주세요.`);
    return false;
  }
  
  return true;
}