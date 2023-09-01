<?php

/* --- Grab Data --- */
if($json = json_decode(file_get_contents("php://input"), true)){
    $data = $json;
} else {
    $data = $_POST;
}

ini_set("memory_limit", "1024M");
ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);

/**
 * Make sure we're running in UTC
 */
date_default_timezone_set("UTC");

/**
 * Setup our Storage Objects
 */
$error = "";
$return = new stdClass();

$user = 'tulgat@chirpish.co:4cbee74a8d2fd247fe707716593d954ac47f4bdc326d5716d6d034e7533e747e';
$user64 = base64_encode('tulgat@chirpish.co:4cbee74a8d2fd247fe707716593d954ac47f4bdc326d5716d6d034e7533e747e');

/* --- Set our headers --- */
$headers = array(
    'accept: application/json',
    'content-type: application/json',
    "Authorization: Basic " . $user64
);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://chirpish.gorgias.com/api/tickets");
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_USERPWD, $user);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, '
{
     "customer": {
          "name": "'.$data["name"].'",
          "email": "'.$data["email"].'"
     },
     "messages": [
          {
               "sender": {
                    "email": "'.$data["email"].'"
               },
               "body_text": "'.$data["message"].'",
               "subject": "Pudgy Penguins Brand",
               "channel": "api",
               "via": "contact_form",
               "from_agent": false
          }
     ],
   "assignee_team": {
        "id": 2386
   }
}
');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

/* --- Store the data: --- */
$json = curl_exec($ch);

$result = json_decode($json, true);
$return->result = $result;

if(curl_error($ch)){
    $error_msg = curl_error($ch);
    $error = $error_msg;
}

curl_close($ch);

echo json_encode($return);


?>
