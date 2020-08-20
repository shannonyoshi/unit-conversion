BEGIN;

CREATE TABLE ingredients (
	id serial primary key,
	name text,
	ratio real
);

CREATE TABLE suggestions (
	id serial PRIMARY KEY,
	name text,
	email text,
	message text NOT NULL,
	is_error boolean,
	created_at DATE NOT NULL DEFAULT CURRENT_DATE,
	viewed_at DATE
);

COMMIT;
