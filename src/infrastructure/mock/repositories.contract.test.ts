import { repositoryContract } from "@/core/ports/__tests__/repositories.contract";

import { fixtureIds } from "./fixtures";
import { createMockRepositories } from "./repositories";

repositoryContract("mock", createMockRepositories, { ids: fixtureIds });
