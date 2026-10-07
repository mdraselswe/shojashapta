import type { NextConfig } from "next";

// Validates the environment at build/start time: a missing or invalid variable fails here.
import { serverEnv } from "./src/config/env";

serverEnv();

const nextConfig: NextConfig = {/* config options here */};

export default nextConfig;
