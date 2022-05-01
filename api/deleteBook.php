<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


include_once '../db.php';
include_once '../books.php';
include_once '../authMiddleware.php';

$database = new Database();
$db = $database->getConnection();
$item = new Book($db);
$allHeaders = getallheaders();
$auth = new Auth($db, $allHeaders);

$isLoggedIn = $auth->isValid();

if ($isLoggedIn["success"] !== 1) {
    echo "You are not logged in.";
} else {
    $item->id = isset($_GET['id']) ? $_GET['id'] : die();

    if ($item->deleteBook()) {
        echo json_encode("Book deleted.");
    } else {
        echo json_encode("Data could not be deleted");
    }
}