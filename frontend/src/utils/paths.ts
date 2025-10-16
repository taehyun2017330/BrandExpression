// Helper to get the correct path with basePath
export const getBasePath = () => {
  // In production (GitHub Pages), use /BrandExpression base path
  // In development, use empty string
  return process.env.NODE_ENV === 'production' ? '/BrandExpression' : '';
};

export const withBasePath = (path: string) => {
  // Don't add basePath to external URLs
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }

  // Add basePath for static assets in production
  const basePath = getBasePath();

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
};