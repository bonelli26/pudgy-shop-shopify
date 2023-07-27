<?php
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

/* --- Grab Data --- */
if($json = json_decode(file_get_contents("php://input"), true)){
    $data = $json;
} else {
    $data = $_POST;
}

if((isset($data["password"]) && $data["password"] !== "")){
    exit("Thank you for signing up!");
}

/* --- Check for Klaviyo API Key --- */
if(isset($data["email"]) && $data["email"] !== ""){
    $klaviyo_obj = new stdClass();
    $klaviyo_obj->profiles = array();
    $klaviyo_obj->profiles[0] = new stdClass();
    $klaviyo_obj->profiles[0]->consent = "web";
    $listID = "XXXXX";
    $klaviyo_url = "https://a.klaviyo.com/api/v2/list/" . $listID . "/subscribe";
    /* --- Loop to grab keys dynamically --- */
    foreach($data as $key => $value){
        if($key !== "g"){
            $klaviyo_obj->profiles[0]->{$key} = $value;
        }
    }

    /* --- Set our headers --- */
    $headers = array(
        "Accept: application/json",
        "Content-Type: application/json",
        "api-key: pk_xxxxxxxxxxxxxxxxxxxxxx"
    );

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $klaviyo_url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($klaviyo_obj));
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

} else {
    $error = "Error" . $data["email"];
}

echo json_encode($return);
