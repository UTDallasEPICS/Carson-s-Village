CREATE TABLE User_Account(
	user_id			INT 			PRIMARY KEY	NOT NULL, 
	email			TEXT			UNIQUE 		NOT NULL,
	user_role		INT				NOT NULL	CHECK(user_role >= 1 AND user_role <= 3),
	password_hash	TEXT			NOT NULL,
	password_salt	TEXT			NOT NULL,
	first_name		TEXT			NOT NULL,
	middle_name		TEXT,
	last_name		TEXT			NOT NULL,
	phone			VARCHAR(10)
);

INSERT INTO User_Account(user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) 
	VALUES(1, 'user_id1', 1, 'password1', 'secret1', 'first1', 'middle1', 'last1', '1000001000');
INSERT INTO User_Account(user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) 
	VALUES(2, 'alexisaj12348@gmail.com', 1, 'password2', 'secret2', 'first2', 'middle2', 'last2', '1000000001');
INSERT INTO User_Account(user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) 
	VALUES(3, 'user_id3', 1, 'password3', 'secret3', 'first3', 'middle3', 'last3', '1000000010');
INSERT INTO User_Account(user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) 
	VALUES(4, 'user_id4', 2, 'password4', 'secret4', 'first4', 'middle4', 'last4', '1000000011');
INSERT INTO User_Account(user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) 
	VALUES(5, 'evelynkha@yahoo.com', 2, 'password5', 'secret5', 'first5', 'middle5', 'last5', '1000000100');
INSERT INTO User_Account(user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) 
	VALUES(6, 'user_id6', 3, 'password6', 'secret6', 'first6', 'middle6', 'last6', '1000000101');
INSERT INTO User_Account(user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) 
	VALUES(7, 'user_id7', 3, 'password7', 'secret7', 'first7', 'middle7', 'last7', '1000000110');
INSERT INTO User_Account(user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) 
	VALUES(8, 'user_id8', 1, 'password8', 'secret8', 'first8', 'middle8', 'last8', '1000000111');
INSERT INTO User_Account(user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) 
	VALUES(9, 'user_id9', 1, 'password9', 'secret9', 'first9', 'middle9', 'last9', '1000001000');
