CREATE DATABASE IF NOT EXISTS default_schema; USE default_schema;
CREATE TABLE IF NOT EXISTS components (
      component_id VARCHAR(255) PRIMARY KEY,
      page_id VARCHAR(255)
    ); 
    CREATE TABLE IF NOT EXISTS component_attributes (
      component_id VARCHAR(255),
      attribute_key VARCHAR(255),
      attribute_value TEXT,
      PRIMARY KEY (component_id, attribute_key),
      FOREIGN KEY (component_id) REFERENCES components(component_id)
    );
INSERT INTO components (component_id, page_id) VALUES ('i1fl', '664eac385fc0e50bf8106887');
INSERT INTO components (component_id, page_id) VALUES ('iprg', '664eac385fc0e50bf8106887');
INSERT INTO component_attributes (component_id, attribute_key, attribute_value) VALUES ('i1fl', 'text', 'sd');
INSERT INTO component_attributes (component_id, attribute_key, attribute_value) VALUES ('iprg', 'text', 'ds');