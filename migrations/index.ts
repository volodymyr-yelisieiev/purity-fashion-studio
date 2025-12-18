import * as migration_initial_schema from './initial_schema';

export const migrations = [
  {
    up: migration_initial_schema.up,
    down: migration_initial_schema.down,
    name: 'initial_schema'
  },
];
