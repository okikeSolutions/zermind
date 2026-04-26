import type { NextConfig } from "next";
import path from "path";

const convexHostname = process.env.NEXT_PUBLIC_CONVEX_URL
  ? new URL(process.env.NEXT_PUBLIC_CONVEX_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  outputFileTracingRoot: path.join(__dirname),
  images: convexHostname
    ? {
        remotePatterns: [
          {
            protocol: "https",
            hostname: convexHostname,
            pathname: "/api/storage/**",
          },
        ],
      }
    : undefined,
  async rewrites() {
    return [
      {
        source: "/js/script.js",
        destination: "https://datafa.st/js/script.js",
      },
      {
        source: "/api/events",
        destination: "https://datafa.st/api/events",
      },
    ];
  },
  async headers() {
    const securityHeaders = [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          // Note: Access-Control-Allow-Origin is handled dynamically in proxy.ts middleware
          // to properly support multiple allowed origins per CORS specification
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          // Prevent clickjacking attacks
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Enable browser XSS protection
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Control referrer information
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions Policy to restrict browser features (comprehensive restrictions)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
    return securityHeaders;
  },
};

export default nextConfig;
