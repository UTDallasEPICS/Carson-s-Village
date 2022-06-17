CREATE TABLE Page_Donations(
	family_id		INT		NOT NULL, 
	page_name		TEXT	NOT NULL, 
	link			TEXT	NOT NULL,
	status			INT		NOT NULL,  
	description		TEXT, 

	PRIMARY KEY(family_id, page_name, link), 

	FOREIGN KEY(family_id, page_name) REFERENCES Page_Details(family_id, page_name)
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
