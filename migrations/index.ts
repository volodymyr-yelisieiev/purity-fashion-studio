import * as migration_20251224_000000_initial from "./20251224_000000_initial";

export const migrations = [
  {
    up: migration_20251224_000000_initial.up,
    down: migration_20251224_000000_initial.down,
    name: "20251224_000000_initial",
  },
];
