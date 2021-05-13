/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	query-builder.js
*		string processing for queries
*/
/*
*	buildInsert(string[], string[], string)
*		builds inser statement based on number of given parameters
*	input:
*			string[]				reqFields	list of request parameters
*			string[]				reqValues	list of request values
*			string					table		name of table in database
*	output:
*			{string, string[]}		query		final INSERT query
*/
module.exports = function(reqFields, reqValues, table) {
	var fields = [];							//list of non-empty fields
	var values = [];							//list of values for each non-empty parameter
	var index = [];								//number of fields available to query
	//check that each request field is not an empty string
	for(var i = 0; i<reqValues.length; i++) {
		if(reqValues[i] != '') {
			fields.push(reqFields[i]);			//add to end of fields
			values.push(reqValues[i]);			//add to end of values
			index.push('$' + fields.length);	//add to end of index
		}
	}
	//query object, standard node-postgres notation
	var query = {
		text: 'INSERT INTO ' + table +' (' + fields.join(', ') + ') VALUES (' + index.join(', ') + ')', 
		values: values
	}
	return query;
}