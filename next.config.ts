import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: quando a imobiliária começar a subir fotos reais hospedadas
    // externamente (ex: um bucket S3/R2), adicionar o domínio aqui pra
    // next/image poder otimizar. Hoje só usamos imagens locais (/public).
    remotePatterns: [],
  },
};

export default nextConfig;
