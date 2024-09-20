CREATE TABLE place (
    place_id INT AUTO_INCREMENT NOT NULL,
    place_name VARCHAR(200) NOT NULL,
    place_phone VARCHAR(100) NOT NULL,
    place_address VARCHAR(1000) NOT NULL,
    place_coords VARCHAR(1000),
    place_photo VARCHAR(1000),
    place_deleted BOOLEAN NOT NULL,
    PRIMARY KEY (place_id)
);

CREATE TABLE products (
    products_id INT AUTO_INCREMENT NOT NULL,
    place_id INT NOT NULL,
    products_name VARCHAR(200) NOT NULL,
    products_price DOUBLE PRECISION NOT NULL,
    products_photo VARCHAR(1000),
    products_deleted BOOLEAN NOT NULL,
    PRIMARY KEY (products_id)
);

CREATE TABLE role (
    role_id INT AUTO_INCREMENT NOT NULL,
    role_name VARCHAR(20) NOT NULL,
    PRIMARY KEY (role_id)
);

CREATE TABLE users (
    users_id INT AUTO_INCREMENT NOT NULL,
    role_id INT NOT NULL,
    users_firstname VARCHAR(50) NOT NULL,
    users_lastname VARCHAR(50) NOT NULL,
    users_username VARCHAR(50) NOT NULL,
    users_password VARCHAR(1000) NOT NULL,
    users_address VARCHAR(1000),
    users_coords VARCHAR(1000),
    users_photo VARCHAR(1000),
    users_vehicle_brand VARCHAR(100),
    users_vehicle_year VARCHAR(10),
    users_vehicle_license VARCHAR(100),
    users_vehicle_color VARCHAR(100),
    users_status BOOLEAN NOT NULL,
    users_accepted BOOLEAN NOT NULL,
    PRIMARY KEY (users_id)
);

CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT NOT NULL,
    users_id INT NOT NULL,
    products_id INT NOT NULL,
    PRIMARY KEY (cart_id)
);

CREATE TABLE bill (
    bill_id INT AUTO_INCREMENT NOT NULL,
    users_id INT NOT NULL,
    bill_users_received INT NOT NULL,
    bill_total_price DOUBLE PRECISION NOT NULL,
    bill_created_at DATETIME NOT NULL,
    bill_status BOOLEAN NOT NULL,
    PRIMARY KEY (bill_id)
);

CREATE TABLE chat (
    chat_id INT AUTO_INCREMENT NOT NULL,
    users_id INT NOT NULL,
    bill_id INT NOT NULL,
    chat_users_id_received INT NOT NULL,
    chat_users_username_received VARCHAR(50) NOT NULL,
    chat_users_fullname VARCHAR(150) NOT NULL,
    chat_message VARCHAR(500) NOT NULL,
    chat_created_at DATETIME NOT NULL,
    PRIMARY KEY (chat_id)
);

CREATE TABLE bill_detail (
    bill_detail_id INT AUTO_INCREMENT NOT NULL,
    bill_id INT NOT NULL,
    place_id INT NOT NULL,
    products_id INT NOT NULL,
    bill_detail_count INT NOT NULL,
    PRIMARY KEY (bill_detail_id)
);

ALTER TABLE
    products
ADD
    CONSTRAINT place_products_fk FOREIGN KEY (place_id) REFERENCES place (place_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    bill_detail
ADD
    CONSTRAINT place_bill_detail_fk FOREIGN KEY (place_id) REFERENCES place (place_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    bill_detail
ADD
    CONSTRAINT products_bill_detail_fk FOREIGN KEY (products_id) REFERENCES products (products_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    cart
ADD
    CONSTRAINT products_cart_fk FOREIGN KEY (products_id) REFERENCES products (products_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    users
ADD
    CONSTRAINT role_users_fk FOREIGN KEY (role_id) REFERENCES role (role_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    bill
ADD
    CONSTRAINT users_bill_fk FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    cart
ADD
    CONSTRAINT users_cart_fk FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    chat
ADD
    CONSTRAINT users_chat_fk FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    bill_detail
ADD
    CONSTRAINT bill_bill_detail_fk FOREIGN KEY (bill_id) REFERENCES bill (bill_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    chat
ADD
    CONSTRAINT bill_chat_fk FOREIGN KEY (bill_id) REFERENCES bill (bill_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

INSERT INTO
    role(role_id, role_name)
VALUES
    (1, 'ADMIN');

INSERT INTO
    role(role_id, role_name)
VALUES
    (2, 'BUYER');

INSERT INTO
    role(role_id, role_name)
VALUES
    (3, 'DRIVER');