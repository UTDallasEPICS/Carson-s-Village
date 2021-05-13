--Page_Details
--Delete all rows in which a family user_id is listed as terminated in the corresponding user account
DELETE FROM Page_Details
	USING User_Account
	WHERE Page_Details.family_id = User_Account.user_id
		AND User_Account.user_role = 3;
--Delete all rows in which a family user_id has a corresponding advocate role in the user account
DELETE FROM Page_Details
	USING User_Account
	WHERE Page_Details.family_id = User_Account.user_id
		AND User_Account.user_role = 2;
--Delete all rows in which the status is listed as terminated
DELETE FROM Page_Details
	WHERE status = 4;

--Page_Donation
-- Delete all rows in which a family user_id is listed as terminated in the corresponding user account
DELETE FROM Page_Donation
	USING User_Account
	WHERE Page_Donation.family_id = User_Account.user_id
		AND User_Account.user_role = 3;
--Delete all rows in which the corresponding page status is either 3 or 4
DELETE FROM Page_Donation
	USING Page_Details
	WHERE Page_Donation.page_name = Page_Details.page_name
		AND Page_Details.status = 3
		OR Page_Details.status = 4;
--Delete all rows in which status is listed as terminated
DELETE FROM Page_Donation
	WHERE status = 3;

--Edit_Review_Log
--Changes made by deleted users are still preserved
--Should changes made on deleted pages still be preserved? 
