export const BASE_URL = (import.meta.env.VITE_IMAGE_BASE_URL || 'https://skin-care-website.onrender.com').replace(/\/$/, '')

const REMOTE_SCHEMES = ['http://', 'https://', 'blob:', 'data:']

export const resolveBackendImageUrl = (imagePath, fallback = '') => {
  if (!imagePath) return fallback

  const normalizedPath = String(imagePath).trim()
  if (!normalizedPath) return fallback

  if (REMOTE_SCHEMES.some((scheme) => normalizedPath.startsWith(scheme))) {
    return normalizedPath
  }

  const strippedPath = normalizedPath.replace(/^\/+/, '')

  if (strippedPath.startsWith('productsimages/')) {
    return `${BASE_URL}/${strippedPath}`
  }

  if (strippedPath.startsWith('uploads/')) {
    return `${BASE_URL}/${strippedPath}`
  }

  return `${BASE_URL}/productsimages/${strippedPath}`
}