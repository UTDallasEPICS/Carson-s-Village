CREATE TABLE User_Account(
	user_id			 			SERIAL PRIMARY KEY, 
	email			TEXT			NOT NULL 		UNIQUE,
	user_role		INT				NOT NULL		CHECK(user_role >= 1 AND user_role <= 3),
	first_name		TEXT			NOT NULL,
	middle_name		TEXT,
	last_name		TEXT			NOT NULL,
	phone			VARCHAR(10)
);

INSERT INTO User_Account(email, user_role, first_name, middle_name, last_name, phone) 
	VALUES('user_id1', 1, 'first1', 'middle1', 'last1', '1000001000');
INSERT INTO User_Account(email, user_role, first_name, middle_name, last_name, phone) 
	VALUES('user_id2', 1, 'first2', 'middle2', 'last2', '1000000001');
INSERT INTO User_Account( email, user_role, first_name, middle_name, last_name, phone) 
	VALUES('user_id3', 1, 'first3', 'middle3', 'last3', '1000000010');
INSERT INTO User_Account(email, user_role, first_name, middle_name, last_name, phone) 
	VALUES('user_id4', 2, 'first4', 'middle4', 'last4', '1000000011');
INSERT INTO User_Account(email, user_role, first_name, middle_name, last_name, phone)
	VALUES('user_id5', 2, 'first5', 'middle5', 'last5', '1000000100');
INSERT INTO User_Account(email, user_role, first_name, middle_name, last_name, phone) 
	VALUES('user_id6', 3, 'first6', 'middle6', 'last6', '1000000101');
INSERT INTO User_Account( email, user_role, first_name, middle_name, last_name, phone)
	VALUES('user_id7', 3, 'first7', 'middle7', 'last7', '1000000110');
INSERT INTO User_Account(email, user_role, first_name, middle_name, last_name, phone)
	VALUES('user_id8', 1, 'first8', 'middle8', 'last8', '1000000111');
INSERT INTO User_Account(email, user_role, first_name, middle_name, last_name, phone)
	VALUES('user_id9', 1, 'first9', 'middle9', 'last9', '1000001000');

CREATE TABLE Page_Details(
	family_id				INT,
	page_name				TEXT,
	status					INT			NOT NULL	CHECK(status >= 1 AND status <= 4), 
	day_of_birth			DATE,
	day_of_passing			DATE,
	visitation_date			DATE, 
	visitation_time			TIME, 
	visitation_location		TEXT, 
	visitation_description	TEXT, 

	funeral_date			DATE, 
	funeral_time			TIME, 
	funeral_location		TEXT, 
	funeral_description		TEXT, 

	obituary				TEXT, 
	images					TEXT[], 

	donation_goal			MONEY		NOT NULL, 
	amount_raised		    MONEY       NOT NULL	default 0,
	deadline				TIMESTAMPTZ	NOT NULL, 
	timezone				TEXT,

	PRIMARY KEY (family_id, page_name),
	FOREIGN KEY (family_id) REFERENCES User_Account(user_id)
);

INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(1, 'page1', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-01-01 00:00', 'visitation_location1', 'visitation_description1', '2000-01-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(1, 'page2', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-01-01 00:00', 'visitation_location1', 'visitation_description1', '2000-01-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(1, 'page3', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-01-01 00:00', 'visitation_location1', 'visitation_description1', '2000-01-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status,  day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(1, 'page4', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-01-01 00:00', 'visitation_location1', 'visitation_description1', '2000-01-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status,  day_of_birth, day_of_passing,visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(2, 'page1', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-02-01 01:00', 'visitation_location1', 'visitation_description1', '2000-02-01 01:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(2, 'page2', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-02-01 01:00', 'visitation_location1', 'visitation_description1', '2000-02-01 01:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(2, 'page3', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-02-01 01:00', 'visitation_location1', 'visitation_description1', '2000-02-01 01:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(2, 'page4', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-02-01 01:00', 'visitation_location1', 'visitation_description1', '2000-02-01 01:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(3, 'page1', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-04-01 00:00', 'visitation_location1', 'visitation_description1', '2000-04-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(4, 'page1', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-04-01 00:00', 'visitation_location1', 'visitation_description1', '2000-04-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(4, 'page2', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-04-01 00:00', 'visitation_location1', 'visitation_description1', '2000-04-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(4, 'page3', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-04-01 00:00', 'visitation_location1', 'visitation_description1', '2000-04-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(4, 'page4', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-04-01 00:00', 'visitation_location1', 'visitation_description1', '2000-04-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(6, 'page1', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-06-01 00:00', 'visitation_location1', 'visitation_description1', '2000-06-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(6, 'page2', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-06-01 00:00', 'visitation_location1', 'visitation_description1', '2000-06-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(6, 'page3', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-06-01 00:00', 'visitation_location1', 'visitation_description1', '2000-06-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');
INSERT INTO Page_Details(family_id, page_name, status, day_of_birth, day_of_passing, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline, timezone) 
	VALUES(6, 'page4', 1, '2000-01-01 00:00','2022-01-01 00:00','2000-06-01 00:00', 'visitation_location1', 'visitation_description1', '2000-06-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02', 'Central Daylight Time');

CREATE TABLE Page_Donations(
	family_id		INT,
	page_name		TEXT,
	link			TEXT,
	status			INT		NOT NULL,  
	description		TEXT, 

	PRIMARY KEY (family_id, page_name, link), 
	FOREIGN KEY (family_id, page_name) REFERENCES Page_Details(family_id, page_name)
);

INSERT INTO Page_Donations(family_id, page_name, link ,status, description)
	VALUES(1, 'page1', 'link1', 2, 'description1');
INSERT INTO Page_Donations(family_id, page_name, link ,status, description)
	VALUES(1, 'page1', 'link2', 1, 'description2');
INSERT INTO Page_Donations(family_id, page_name, link ,status, description)
	VALUES(1, 'page2', 'link1', 3, 'description3');
INSERT INTO Page_Donations(family_id, page_name, link ,status, description)
	VALUES(2, 'page1', 'link1', 3, 'description1');
INSERT INTO Page_Donations(family_id, page_name, link ,status, description)
	VALUES(2, 'page2', 'link2', 1, 'description2');
INSERT INTO Page_Donations(family_id, page_name, link ,status, description)
	VALUES(2, 'page2', 'link3', 2, 'description3');
INSERT INTO Page_Donations(family_id, page_name, link ,status, description)
	VALUES(6, 'page1', 'link1', 2, 'description1');
INSERT INTO Page_Donations(family_id, page_name, link ,status, description)
	VALUES(6, 'page1', 'link2', 2, 'description2');
INSERT INTO Page_Donations(family_id, page_name, link ,status, description)
	VALUES(6, 'page1', 'link3', 1, 'description3');

CREATE TABLE Edit_Review_Log(
	editor_id		INT,
	family_id		INT,
	page_name		TEXT,
	edit_date		TIMESTAMP,
	edit_code		VARCHAR(16)		NOT NULL, 
	edit_comment	TEXT			NOT NULL, 

	PRIMARY KEY (editor_id, family_id, page_name, edit_date),
	FOREIGN KEY (family_id, page_name) REFERENCES Page_Details(family_id, page_name)
);

INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(1, 1, 'page1', '2000-01-01 00:01', '1000000000000000', 'comment1');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(1, 2, 'page2', '2000-01-01 00:01', '1000000000000001', 'comment2');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(1, 3, 'page1', '2000-01-01 00:01', '1000000000000001', 'comment3');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(1, 4, 'page2', '2000-01-01 00:01', '1000000000000000', 'comment4');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(4, 1, 'page1', '2000-01-01 00:01', '1000000000000000', 'comment1');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(4, 2, 'page2', '2000-01-01 00:01', '1000000000000001', 'comment2');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(4, 3, 'page1', '2000-01-01 00:01', '1000000000000001', 'comment3');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(4, 4, 'page2', '2000-01-01 00:01', '1000000000000000', 'comment4');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(6, 1, 'page1', '2000-01-01 00:01', '1000000000000000', 'comment1');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(6, 2, 'page2', '2000-01-01 00:01', '1000000000000001', 'comment2');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(6, 3, 'page1', '2000-01-01 00:01', '1000000000000001', 'comment3');
INSERT INTO Edit_Review_Log(editor_id, family_id, page_name, edit_date, edit_code, edit_comment)
	VALUES(6, 4, 'page2', '2000-01-01 00:01', '1000000000000000', 'comment4');

CREATE TABLE Transactions(
	transaction_id		TEXT	NOT NULL,
	transaction_amount	MONEY		NOT NULL	default 0,
	family_id			INT		NOT NULL,
	page_name			TEXT	NOT NULL,
	success				BOOL	NOT NULL	default false,

	PRIMARY KEY (transaction_id),
	FOREIGN KEY (family_id) REFERENCES User_Account(user_id)
);
