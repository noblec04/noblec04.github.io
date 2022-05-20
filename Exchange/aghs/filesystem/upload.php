<?php
$filename = $_FILES["file"]["name"];
$filesize = $_FILES["file"]["size"];
$filetype = $_FILES["file"]["type"];
$filetmp = $_FILES["file"]["tmp_name"];
$error = $_FILES["file"]["error"];

if ($filetype == "image/jpg" || $filetype == "image/png" || $filetype == "image/gif")
  {
  if ($error != 0)
    {
    echo "Return Code: $error <br />";
    }
  else
    {
    echo "Upload: $filename <br />";
    echo "Type: $filetype <br />";
    echo "Size: filesize Kb<br />";
    echo "Temp file: $filetmp <br />";
	
	$dir = $filename;
	
	if ($_POST["directory"])
	{
	
	     mkdir($_POST["directory"]);

	  
	  	$dir = $_POST["directory"] . "/" . $filename;
	  
	};
	
      move_uploaded_file($filetmp,$dir);
	  
      echo "File uploaded";
    }
  }
else
  {
  echo "Invalid file";
  }
  
  if($_POST["delete"]){
  		unlink($_POST["delete"]);
  }
?> 
