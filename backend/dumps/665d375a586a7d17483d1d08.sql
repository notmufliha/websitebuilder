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
INSERT INTO components (component_id, page_id) VALUES ('i3qe', '665d375a586a7d17483d1d08');
INSERT INTO components (component_id, page_id) VALUES ('iza8', '665d375a586a7d17483d1d08');
INSERT INTO components (component_id, page_id) VALUES ('izs5', '665d375a586a7d17483d1d08');
INSERT INTO component_attributes (component_id, attribute_key, attribute_value) VALUES ('i3qe', 'text', 'Insert your text e');
INSERT INTO component_attributes (component_id, attribute_key, attribute_value) VALUES ('iza8', 'text', 'Insert your text hereew');
INSERT INTO component_attributes (component_id, attribute_key, attribute_value) VALUES ('izs5', 'text', 'Insert your text herewq');