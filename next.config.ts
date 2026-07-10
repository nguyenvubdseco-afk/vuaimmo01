import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Tệp phần mềm cho phép tối đa 200MB (xem MAX_SOFTWARE_BYTES trong src/lib/store.ts),
      // để dư cho phần overhead của multipart/form-data (boundary, header từng field...).
      bodySizeLimit: "210mb",
    },
  },
};

export default nextConfig;
