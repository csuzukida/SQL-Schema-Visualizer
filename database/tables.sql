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
  height INTEGER,
)