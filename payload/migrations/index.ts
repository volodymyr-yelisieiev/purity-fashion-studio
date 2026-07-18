import * as migration_20260716_223359_initial_prd_schema from './20260716_223359_initial_prd_schema';
import * as migration_20260716_224208_offer_polymorphic_owner from './20260716_224208_offer_polymorphic_owner';
import * as migration_20260716_225724 from './20260716_225724';
import * as migration_20260716_231615 from './20260716_231615';
import * as migration_20260716_233822_payment_provider_id from './20260716_233822_payment_provider_id';
import * as migration_20260716_234850_payment_notification_state from './20260716_234850_payment_notification_state';
import * as migration_20260717_143501 from './20260717_143501';
import * as migration_20260717_154226 from './20260717_154226';
import * as migration_20260717_160309 from './20260717_160309';
import * as migration_20260718_025411_payload_public_copy from './20260718_025411_payload_public_copy';

export const migrations = [
  {
    up: migration_20260716_223359_initial_prd_schema.up,
    down: migration_20260716_223359_initial_prd_schema.down,
    name: '20260716_223359_initial_prd_schema',
  },
  {
    up: migration_20260716_224208_offer_polymorphic_owner.up,
    down: migration_20260716_224208_offer_polymorphic_owner.down,
    name: '20260716_224208_offer_polymorphic_owner',
  },
  {
    up: migration_20260716_225724.up,
    down: migration_20260716_225724.down,
    name: '20260716_225724',
  },
  {
    up: migration_20260716_231615.up,
    down: migration_20260716_231615.down,
    name: '20260716_231615',
  },
  {
    up: migration_20260716_233822_payment_provider_id.up,
    down: migration_20260716_233822_payment_provider_id.down,
    name: '20260716_233822_payment_provider_id',
  },
  {
    up: migration_20260716_234850_payment_notification_state.up,
    down: migration_20260716_234850_payment_notification_state.down,
    name: '20260716_234850_payment_notification_state',
  },
  {
    up: migration_20260717_143501.up,
    down: migration_20260717_143501.down,
    name: '20260717_143501',
  },
  {
    up: migration_20260717_154226.up,
    down: migration_20260717_154226.down,
    name: '20260717_154226',
  },
  {
    up: migration_20260717_160309.up,
    down: migration_20260717_160309.down,
    name: '20260717_160309'
  },
  {
    up: migration_20260718_025411_payload_public_copy.up,
    down: migration_20260718_025411_payload_public_copy.down,
    name: '20260718_025411_payload_public_copy'
  },
];
