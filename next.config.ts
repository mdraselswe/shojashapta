import type { NextConfig } from "next";

// Validates the environment at build/start time: a missing or invalid variable fails here.
import { serverEnv } from "./src/config/env";

serverEnv();

const nextConfig: NextConfig = {
  async headers() {
    // Font files never change in place (rename on update), so browsers may cache them for a year.
    return [
      {
        source: "/fonts/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
