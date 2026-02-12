import * as migration_20260205_151710_initial from "./20260205_151710_initial";
import * as migration_20260205_212926_hardened_editorial_schemas from "./20260205_212926_hardened_editorial_schemas";
import * as migration_20260205_212944_hardened_editorial_schemas_v2 from "./20260205_212944_hardened_editorial_schemas_v2";
import * as migration_20260208_182400_add_posts_collection from "./20260208_182400_add_posts_collection";
import * as migration_20260210_0200_add_media_purpose from "./20260210_0200_add_media_purpose";
import * as migration_20260210_191731_fix_enums_and_urls from "./20260210_191731_fix_enums_and_urls";

export const migrations = [
  {
    up: migration_20260205_151710_initial.up,
    down: migration_20260205_151710_initial.down,
    name: "20260205_151710_initial",
  },
  {
    up: migration_20260205_212926_hardened_editorial_schemas.up,
    down: migration_20260205_212926_hardened_editorial_schemas.down,
    name: "20260205_212926_hardened_editorial_schemas",
  },
  {
    up: migration_20260205_212944_hardened_editorial_schemas_v2.up,
    down: migration_20260205_212944_hardened_editorial_schemas_v2.down,
    name: "20260205_212944_hardened_editorial_schemas_v2",
  },
  {
    up: migration_20260208_182400_add_posts_collection.up,
    down: migration_20260208_182400_add_posts_collection.down,
    name: "20260208_182400_add_posts_collection",
  },
  {
    up: migration_20260210_0200_add_media_purpose.up,
    down: migration_20260210_0200_add_media_purpose.down,
    name: "20260210_0200_add_media_purpose",
  },
  {
    up: migration_20260210_191731_fix_enums_and_urls.up,
    down: migration_20260210_191731_fix_enums_and_urls.down,
    name: "20260210_191731_fix_enums_and_urls",
  },
];
