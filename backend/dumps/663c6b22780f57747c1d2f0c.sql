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
    (29, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (30, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (31, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (45, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (46, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (47, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (48, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (49, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (50, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (51, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (52, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (53, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (54, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (55, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (56, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (57, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (58, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (59, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (60, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (61, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (62, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (63, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (64, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (65, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (66, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (67, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (68, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (69, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (70, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (71, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (72, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (73, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (74, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (75, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (76, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (77, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (78, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (79, '663c6b22780f57747c1d2f0c');

INSERT INTO
    components (component_id, page_id)
VALUES
    (80, '663c6b22780f57747c1d2f0c');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (29, 'text', 'ds32234');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (
        30,
        'src',
        'http://localhost:8080/uploads/myImage-1713948539506.jpeg'
    );

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (30, 'alt', '');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (31, 'text', 'sdfdfre');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (45, 'text', 'ds32234');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (
        46,
        'src',
        'http://localhost:8080/uploads/myImage-1713948539506.jpeg'
    );

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (46, 'alt', '');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (47, 'text', 'sdfdfre');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (48, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (49, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (50, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (51, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (52, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (53, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (54, 'text', 'ds32234');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (
        55,
        'src',
        'http://localhost:8080/uploads/myImage-1713948539506.jpeg'
    );

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (55, 'alt', '');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (56, 'text', 'sdfdfre');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (57, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (58, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (59, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (60, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (61, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (62, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (63, 'text', 'ds32234');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (
        64,
        'src',
        'http://localhost:8080/uploads/myImage-1713948539506.jpeg'
    );

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (64, 'alt', '');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (65, 'text', 'sdfdfre');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (66, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (67, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (68, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (69, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (70, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (71, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (72, 'text', 'ds32234');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (
        73,
        'src',
        'http://localhost:8080/uploads/myImage-1713948539506.jpeg'
    );

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (73, 'alt', '');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (74, 'text', 'sdfdfre');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (75, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (76, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (77, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (78, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (79, 'text', 'Insert your text here');

INSERT INTO
    component_attributes (component_id, attribute_key, attribute_value)
VALUES
    (80, 'text', 'Insert your text here');