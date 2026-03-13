import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.palmsbet.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gis-static.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.everymatrix.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "agstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "palmsbet.bestra.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "palmsbet-dk2.pragmaticplay.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d2yiecdqtjp18w.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "f8spaces.sgp1.cdn.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.palmsbet.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "actar.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
