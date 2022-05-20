<?php
$to = $_POST['to'];
$subject = $_POST['subject'];
$body = $_POST['message'];
$from = $_POST['from'];
$headers = 'From:'.$from;
if (mail($to, $subject, $body,$headers)) {
  echo("<p>Message successfully sent!</p>");
 } else {
  echo("<p>Message delivery failed...</p>");
 }
?>