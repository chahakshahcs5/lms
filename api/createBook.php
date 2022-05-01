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
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);


$item->title = $input['title'];
$item->category = $input['category'];
$item->author = $input['author'];
$item->bookUrl = $input['bookUrl'];
$item->createdAt = date('Y-m-d H:i:s');

$isLoggedIn = $auth->isValid();

if ($isLoggedIn["success"] !== 1) {
    echo "You are not logged in.";
} else {
    if ($item->createBook()) {
        echo 'Book created successfully.';
    } else {
        echo 'Book could not be created.';
    }
}