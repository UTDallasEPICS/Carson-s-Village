CREATE TABLE Edit_Review_Log(
	editor_id		INT				NOT NULL, 
	family_id		TEXT			NOT NULL, 
	page_name		TEXT			NOT NULL, 
	edit_date		TIMESTAMP		NOT NULL, 
	edit_code		VARCHAR(16)		NOT NULL, 
	edit_comment	TEXT			NOT NULL, 

	PRIMARY KEY(editor_id, family_id, page_name, edit_date)
	--FOREIGN KEY(family_id, page_name) REFERENCES Page_Details(family_id, page_name)
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
