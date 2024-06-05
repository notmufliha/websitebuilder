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
INSERT INTO components (component_id, page_id) VALUES ('ibul', '665d33e8a7cdcf924cf154ab');
INSERT INTO components (component_id, page_id) VALUES ('il5b', '665d33e8a7cdcf924cf154ab');