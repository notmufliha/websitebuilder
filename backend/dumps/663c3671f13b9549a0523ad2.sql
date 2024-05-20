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
    (25, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (26, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (27, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (28, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (32, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (33, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (34, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (35, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (36, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (37, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (38, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (39, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (40, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (41, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (42, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (43, '663c3671f13b9549a0523ad2');

INSERT INTO
    components (component_id, page_id)
VALUES
    (44, '663c3671f13b9549a0523ad2');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (25, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (26, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (27, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (28, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (32, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (33, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (34, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (35, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (36, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (37, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (38, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (39, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (40, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (41, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (42, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (43, 'text', 'Insert your text sddssds');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (44, 'text', 'Insert your text sddssds');