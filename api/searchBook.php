<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../db.php';
include_once '../books.php';
include_once '../authMiddleware.php';

$database = new Database();

$db = $database->getConnection();
$allHeaders = getallheaders();
$auth = new Auth($db, $allHeaders);

$isLoggedIn = $auth->isValid();

if ($isLoggedIn["success"] !== 1) {
    echo "You are not logged in.";
} else {
    $items = new Book($db);
    $items->title = $_GET["title"];
    $records = $items->getBookByName() ? $items->getBookByName() : die($db->error);
    $itemCount = $records->num_rows;
    echo json_encode($itemCount);
    if ($itemCount > 0) {
        $bookArr = array();
        $bookArr["body"] = array();
        $bookArr["itemCount"] = $itemCount;
        while ($row = $records->fetch_assoc()) {
            array_push($bookArr["body"], $row);
        }
        echo json_encode($bookArr);
    } else {
        http_response_code(404);
        echo json_encode(
            array("message" => "No record found.")
        );
    }
}