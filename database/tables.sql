CREATE TABLE IF NOT EXISTS people (
  _id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  mass VARCHAR(50),
  hair_color VARCHAR(50),
  skin_color VARCHAR(50),
  eye_color VARCHAR(50),
  birth_year VARCHAR(50),
  gender VARCHAR(50),
  species_id BIGINT REFERENCES species(_id),
  homeworld_id BIGINT REFERENCES planets(_id),
  height INTEGER
);

CREATE TABLE IF NOT EXISTS species (
  _id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  classification VARCHAR(50),
  average_height VARCHAR(50),
  average_lifespan VARCHAR(50),
  hair_colors VARCHAR(50),
  skin_colors VARCHAR(50),
  eye_colors VARCHAR(50),
  language VARCHAR(50),
  homeworld_id BIGINT REFERENCES planets(_id)
);

CREATE TABLE IF NOT EXISTS planets (
  _id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50),
  rotation_period INTEGER,
  diameter INTEGER,
  orbital_period INTEGER,
  climate VARCHAR(50),
  gravity VARCHAR(50),
  terrain VARCHAR(50),
  surface_water VARCHAR(50),
  population VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS vessels (
  _id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  manufacturer VARCHAR(50),
  model VARCHAR(50),
  vessel_type VARCHAR(50) NOT NULL,
  vessel_class VARCHAR(50) NOT NULL,
  cost_in_credits BIGINT,
  length VARCHAR(50),
  max_atmosphering_speed VARCHAR(50),
  crew INTEGER,
  passengers INTEGER,
  cargo_capacity VARCHAR(50),
  consumables VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS starships_specs (
  _id BIGSERIAL PRIMARY KEY,
  hyperdrive_rating VARCHAR(50),
  MGLT VARCHAR(50),
  vessel_id BIGINT REFERENCES vessels(_id)
);

CREATE TABLE IF NOT EXISTS films (
  _id BIGSERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  episode_id INTEGER NOT NULL,
  opening_crawl VARCHAR(500) NOT NULL,
  director VARCHAR(50) NOT NULL,
  producer VARCHAR(50) NOT NULL,
  release_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS pilots (
  _id BIGSERIAL PRIMARY KEY,
  person_id BIGINT REFERENCES people(_id),
  vessel_id BIGINT REFERENCES vessels(_id)
);

CREATE TABLE IF NOT EXISTS people_in_films (
  _id BIGSERIAL PRIMARY KEY,
  person_id BIGINT REFERENCES people(_id),
  film_id BIGINT REFERENCES films(_id)
);

CREATE TABLE IF NOT EXISTS species_in_films (
  _id BIGSERIAL PRIMARY KEY,
  film_id BIGINT REFERENCES films(_id),
  species_id BIGINT REFERENCES species(_id)
);

CREATE TABLE IF NOT EXISTS planets_in_films (
  _id BIGSERIAL PRIMARY KEY,
  film_id BIGINT REFERENCES films(_id),
  planet_id BIGINT REFERENCES planets(_id)
);

CREATE TABLE IF NOT EXISTS vessels_in_films (
  _id BIGSERIAL PRIMARY KEY,
  film_id BIGINT REFERENCES films(_id),
  vessel_id BIGINT REFERENCES vessels(_id)
);