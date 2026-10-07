-- 0002_indexes: search (pg_trgm), hot read paths and moderation queues (docs/04-database.md §4).

create index foods_search_text_trgm on foods using gin (search_text extensions.gin_trgm_ops);
create index foods_search_key_trgm on foods using gin (search_key extensions.gin_trgm_ops);
create index places_search_text_trgm on places using gin (search_text extensions.gin_trgm_ops);
create index places_search_key_trgm on places using gin (search_key extensions.gin_trgm_ops);
create index districts_search_key_trgm on districts using gin (search_key extensions.gin_trgm_ops);
create index aliases_search_key_trgm on aliases using gin (search_key extensions.gin_trgm_ops);

create index places_district_status on places (district_id, status);
create index places_location on places using gist (location);

create index dishes_food_rank on dishes (food_id, wilson_score desc) where status = 'active';
create index dishes_place_rank on dishes (place_id, wilson_score desc) where status = 'active';

create index experiences_dish_recent on experiences (dish_id, created_at desc) where status = 'active';
create index experiences_user_recent on experiences (user_id, created_at desc);

create index claims_entity on claims (entity, entity_id);
create index claims_expiry on claims (expires_at) where expires_at is not null;

create index media_entity on media (entity, entity_id) where status = 'active';
create index rate_limit_events_lookup on rate_limit_events (user_id, action, created_at desc);
create index edit_suggestions_open on edit_suggestions (status, created_at) where status = 'open';
create index reports_open on reports (status, created_at) where status = 'open';
