const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

/**
 * Password helper with lazy-migration support.
 *
 * Existing production rows store plaintext passwords. We cannot hard-cut to
 * bcrypt without locking out every existing user, so:
 *   - new/changed passwords are hashed (hashPassword)
 *   - login uses verifyPassword(), which detects whether the stored value is a
 *     bcrypt hash. If yes -> bcrypt.compare. If no (legacy plaintext) -> plain
 *     compare, and the caller re-saves a hashed copy so the user auto-migrates.
 */
const passwordHelper = {
  SALT_ROUNDS,

  /** True if the stored value is already a bcrypt hash ($2a$/$2b$/$2y$...). */
  isHashed(value) {
    return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
  },

  /** Hash a plaintext password. */
  async hashPassword(plain) {
    return bcrypt.hash(String(plain), SALT_ROUNDS);
  },

  /**
   * Verify a candidate password against the stored value.
   * Returns { ok, needsRehash } — needsRehash=true means the stored value was
   * legacy plaintext and the caller should persist a hashed copy.
   */
  async verifyPassword(candidate, stored) {
    if (stored == null) return { ok: false, needsRehash: false };
    if (passwordHelper.isHashed(stored)) {
      const ok = await bcrypt.compare(String(candidate), stored);
      return { ok, needsRehash: false };
    }
    // legacy plaintext path
    const ok = String(candidate) === String(stored);
    return { ok, needsRehash: ok };
  },
};

module.exports = passwordHelper;
