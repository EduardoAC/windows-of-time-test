<?php
$decoded = base64_decode($_POST['json']);
echo $decoded;
$jsonFile = fopen('data/info.json','w+');
fwrite($jsonFile,$decoded);
fclose($jsonFile);

echo true;