CREATE DATABASE IF NOT EXISTS default_schema; USE default_schema;      CREATE TABLE IF NOT EXISTS components (       component_id INT AUTO_INCREMENT PRIMARY KEY,       page_id VARCHAR(255)     );      CREATE TABLE IF NOT EXISTS component_attributes (       component_id INT,       attribute_key VARCHAR(255),       attribute_value TEXT,       PRIMARY KEY (component_id, attribute_key),       FOREIGN KEY (component_id) REFERENCES components(component_id)     );    INSERT INTO components (component_id, page_id) VALUES ('imzu', '664bfd1411c84435bc0758bf'); INSERT INTO components (component_id, page_id) VALUES ('ipsy', '664bfd1411c84435bc0758bf'); INSERT INTO component_attributes (component_id, attribute_key, attribute_value) VALUES ('imzu', 'text', 'sdsd'); INSERT INTO component_attributes (component_id, attribute_key, attribute_value) VALUES ('ipsy', 'text', 'Insert your text heresdsds');