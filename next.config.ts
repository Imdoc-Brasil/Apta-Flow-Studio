import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // TypeScript e ESLint validation habilitados para garantir qualidade

  // Configuração de variáveis de ambiente
  env: {
    GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY || '',
  },

  // Configuração de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Otimizações para produção
  reactStrictMode: true,

  // Configuração para Firebase Hosting
  output: 'standalone',
}

export default nextConfig

