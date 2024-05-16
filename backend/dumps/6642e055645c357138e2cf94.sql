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

INSERT INTO
    components (component_id, page_id)
VALUES
    ('i7or', '6642e055645c357138e2cf94');

INSERT INTO
    components (component_id, page_id)
VALUES
    ('islz', '6642e055645c357138e2cf94');

INSERT INTO
    components (component_id, page_id)
VALUES
    ('ivli', '6642e055645c357138e2cf94');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    ('i7or', 'text', 'ew');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    ('islz', 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    ('ivli', 'text', 'we');