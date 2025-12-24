import * as migration_add_lookbook_fields_v3 from './add_lookbook_fields_v3';
import * as migration_add_price_and_image_fields from './add_price_and_image_fields';
import * as migration_add_new_categories from './add_new_categories';
import * as migration_add_portfolio_fields from './add_portfolio_fields';
import * as migration_add_bookable_payment_flags from './add_bookable_payment_flags';
import * as migration_add_courses_fields from './add_courses_fields';
import * as migration_add_services_child_tables from './add_services_child_tables';
import * as migration_initial_schema from './initial_schema';

export const migrations = [
  {
    up: migration_add_lookbook_fields_v3.up,
    down: migration_add_lookbook_fields_v3.down,
    name: 'add_lookbook_fields_v3',
  },
  {
    up: migration_add_price_and_image_fields.up,
    down: migration_add_price_and_image_fields.down,
    name: 'add_price_and_image_fields',
  },
  {
    up: migration_add_bookable_payment_flags.up,
    down: migration_add_bookable_payment_flags.down,
    name: 'add_bookable_payment_flags',
  },
  {
    up: migration_add_courses_fields.up,
    down: migration_add_courses_fields.down,
    name: 'add_courses_fields',
  },
  {
    up: migration_add_services_child_tables.up,
    down: migration_add_services_child_tables.down,
    name: 'add_services_child_tables',
  },
  {
    up: migration_add_new_categories.up,
    down: migration_add_new_categories.down,
    name: 'add_new_categories',
  },
  {
    up: migration_add_portfolio_fields.up,
    down: migration_add_portfolio_fields.down,
    name: 'add_portfolio_fields',
  },
  {
    up: migration_initial_schema.up,
    down: migration_initial_schema.down,
    name: 'initial_schema'
  },
];
