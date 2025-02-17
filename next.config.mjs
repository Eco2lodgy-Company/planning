/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // Désactive ESLint pendant la construction
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;
  