CREATE TABLE Page_Details(
	family_id				INT			NOT NULL	REFERENCES User_Account(user_id), 
	page_name				TEXT		NOT NULL, 
	status					INT			NOT NULL	CHECK(status >= 1 AND status <= 4), 

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
	deadline				DATE		NOT NULL, 

	PRIMARY KEY(family_id, page_name) 
);

INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(1, 'page1', 1, '2000-01-01 00:00', 'visitation_location1', 'visitation_description1', '2000-01-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(1, 'page2', 1, '2000-01-01 00:00', 'visitation_location1', 'visitation_description1', '2000-01-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(1, 'page3', 1, '2000-01-01 00:00', 'visitation_location1', 'visitation_description1', '2000-01-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(1, 'page4', 1, '2000-01-01 00:00', 'visitation_location1', 'visitation_description1', '2000-01-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(2, 'page1', 1, '2000-02-01 01:00', 'visitation_location1', 'visitation_description1', '2000-02-01 01:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(2, 'page2', 1, '2000-02-01 01:00', 'visitation_location1', 'visitation_description1', '2000-02-01 01:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(2, 'page3', 1, '2000-02-01 01:00', 'visitation_location1', 'visitation_description1', '2000-02-01 01:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(2, 'page4', 1, '2000-02-01 01:00', 'visitation_location1', 'visitation_description1', '2000-02-01 01:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(4, 'page1', 1, '2000-04-01 00:00', 'visitation_location1', 'visitation_description1', '2000-04-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(4, 'page2', 1, '2000-04-01 00:00', 'visitation_location1', 'visitation_description1', '2000-04-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(4, 'page3', 1, '2000-04-01 00:00', 'visitation_location1', 'visitation_description1', '2000-04-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(4, 'page4', 1, '2000-04-01 00:00', 'visitation_location1', 'visitation_description1', '2000-04-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(6, 'page1', 1, '2000-06-01 00:00', 'visitation_location1', 'visitation_description1', '2000-06-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(6, 'page2', 1, '2000-06-01 00:00', 'visitation_location1', 'visitation_description1', '2000-06-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(6, 'page3', 1, '2000-06-01 00:00', 'visitation_location1', 'visitation_description1', '2000-06-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
INSERT INTO Page_Details(family_id, page_name, status, visitation_date, visitation_location, visitation_description, funeral_date, funeral_location, funeral_description, obituary, images, donation_goal, deadline) 
	VALUES(6, 'page4', 1, '2000-06-01 00:00', 'visitation_location1', 'visitation_description1', '2000-06-01 00:01', 'funeral_location1', 'funeral_description`', 'obituary1', ARRAY['image1', 'image2', 'image3'], 1000, '2000-01-01 00:02');
