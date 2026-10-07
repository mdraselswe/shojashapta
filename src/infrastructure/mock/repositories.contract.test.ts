import { repositoryContract } from "@/core/ports/__tests__/repositories.contract";

import { createMockRepositories } from "./repositories";

repositoryContract("mock", createMockRepositories);
