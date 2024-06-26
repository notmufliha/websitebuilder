CREATE DATABASE IF NOT EXISTS default_schema;

USE default_schema;

CREATE TABLE IF NOT EXISTS components (
    component_id INT AUTO_INCREMENT PRIMARY KEY,
    page_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS component_attributes (
    component_id INT,
    attribute_key VARCHAR(255),
    attribute_value TEXT,
    PRIMARY KEY (component_id, attribute_key),
    FOREIGN KEY (component_id) REFERENCES components(component_id)
);