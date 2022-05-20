<?php

$host = $_GET['host'];
$user = $_GET['user'];
$pass = $_GET['pass'];
$database = $_GET['database'];

$functions = array();

$link = mysql_connect($host,$user,$pass);

if (!$link) {die('Not connected : ' . mysql_error());}

// make foo the current db
$db_selected = mysql_select_db($database, $link);

if (!$db_selected) {
    die ('Can\'t use' . $database .' : ' . mysql_error());
}

$table = mysql_real_escape_string($_GET['table']);



$functions['insert'] = function(){
	$table = mysql_real_escape_string($_GET['table']);
	$columns = $_GET['columns'];
	$values = $_GET['values'];
	
	$colsexp = explode(',',$columns);
	$valsexp = explode(',',$values);
	
	for($i=0;$i<count($colsexp);$i++)
	{
		$var = $colsexp[$i];
		$colsexp[$i] = "`".$var."`";
		if($valsexp[$i]){
		$var2 = $valsexp[$i];
		$valsexp[$i] = "'".$var2."'";
		}else{$valsexp[$i]="NULL";};
	};
	
	$columns2 = implode(',',$colsexp);
	$values2 = implode(',',$valsexp);
	
	$database = $_GET['database'];
	$query = "INSERT INTO `".$database."`.`".$table."` (".$columns2.") VALUES (".$values2.")";
	// Perform Query
	global $result;
	$result  = mysql_query($query);

	// Check result
	// This shows the actual query sent to MySQL, and the error. Useful for debugging.
	if (!$result) {
		$success = false;
   	 	$message  = 'Invalid query: ' . mysql_error() . "\n";
    	$message .= 'Whole query: ' . $query;
    	die($message);
	}else{$success = true;};

	// Use result
	// Attempting to print $result won't allow access to information in the resource
	// One of the mysql result functions must be used
	// See also mysql_result(), mysql_fetch_array(), mysql_fetch_row(), etc.
	if($success){
	echo('Your registeration was succesful');
	};
};

$functions['query'] = function(){
	$table = mysql_real_escape_string($_GET['table']);
	$userquery = mysql_real_escape_string($_GET['qy']);
	if($userquery != undefined){$query = ($userquery);}else{$query = sprintf("SELECT * FROM $table");};
	// Perform Query
	global $result;
	$result  = mysql_query($query);

	// Check result
	// This shows the actual query sent to MySQL, and the error. Useful for debugging.
	if (!$result) {
   	 	$message  = 'Invalid query: ' . mysql_error() . "\n";
    	$message .= 'Whole query: ' . $query;
    	die($message);
	}

	// Use result
	// Attempting to print $result won't allow access to information in the resource
	// One of the mysql result functions must be used
	// See also mysql_result(), mysql_fetch_array(), mysql_fetch_row(), etc.
	while ($row = mysql_fetch_array($result)) {
		for($i=0;$i<count($row);$i++){
			echo $row[$i];
		}
	}
};

$functions['table'] = function(){
	$table = mysql_real_escape_string($_GET['table']);
	$fields = mysql_real_escape_string($_GET['fields']);
	$query = "SELECT $fields FROM $table";
	// Perform Query
	global $result;
	$result  = mysql_query($query);

	// Check result
	// This shows the actual query sent to MySQL, and the error. Useful for debugging.
	if (!$result) {
   	 	$message  = 'Invalid query: ' . mysql_error() . "\n";
    	$message .= 'Whole query: ' . $query;
    	die($message);
	}

	// Use result
	// Attempting to print $result won't allow access to information in the resource
	// One of the mysql result functions must be used
	// See also mysql_result(), mysql_fetch_array(), mysql_fetch_row(), etc.
	
	$fields = explode(',', $fields);
	$ar = array();
	for($i=0;$i<count($fields);$i++){
		$ar[$fields[$i]] = array();
	}
	while ($row = mysql_fetch_assoc($result)) {
		for($i=0;$i<count($row);$i++){
			array_push($ar[$fields[$i]],$row[$fields[$i]]);
		}
		
	}
	
	echo json_encode($ar);

};

$func = $_GET['funct'];
$functions[$func]();


// Free the resources associated with the result set
// This is done automatically at the end of the script
?>