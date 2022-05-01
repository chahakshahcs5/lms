<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../db.php';
include_once '../authMiddleware.php';

$allHeaders = getallheaders();
$database = new Database();
$db = $database->getConnection();
$auth = new Auth($db, $allHeaders);

echo json_encode($auth->isValid());