import { createMfaRepository } from "./repositories/mfaRepository.js";
import { createRefreshRepository } from "./repositories/refreshRepository.js";
import { createAdminRepository } from "../admins/adminRepository.js";
import { createRegistrationRepository } from "./repositories/registrationRepository.js";
import { createActivationRepository } from "./repositories/activationRepository.js";
import { createSessionRepository } from "./repositories/sessionRepository.js";
import { createRateLimitRepository } from "./repositories/rateLimitRepository.js";

export function createAuthRepository(db) {
  return {
    ...createAdminRepository(db),
    ...createMfaRepository(db),
    ...createRegistrationRepository(db),
    ...createActivationRepository(db),
    ...createSessionRepository(db),
    ...createRefreshRepository(db),
    ...createRateLimitRepository(db),
  };
}
