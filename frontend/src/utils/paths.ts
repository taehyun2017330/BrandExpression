// Helper to get the correct path with basePath
export const getBasePath = () => {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    // Custom domain (taehyun.me) - use /BrandExpression base path
    // GitHub Pages (*.github.io) - use /BrandExpression base path
    // Localhost - no base path
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '';
    }
    return '/BrandExpression';
  }

  // Server-side: use /BrandExpression for production builds
  return process.env.NODE_ENV === 'production' ? '/BrandExpression' : '';
};

export const withBasePath = (path: string) => {
  // Don't add basePath to external URLs
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }

  // Add basePath for static assets
  const basePath = getBasePath();

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
};