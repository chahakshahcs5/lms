<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../db.php';
include_once '../users.php';
$database = new Database();
$db = $database->getConnection();
$data = new User($db);
$db_table = "users";

function msg($success, $status, $message, $extra = [])
{
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ], $extra);
}

// DATA FORM REQUEST
$input = json_decode(file_get_contents("php://input"), true);
$returnData = [];
$data->name = $input["name"];
$data->email = $input["email"];
$data->password = $input["password"];
$data->confirmPassword = $input["confirmPassword"];
if ($_SERVER["REQUEST_METHOD"] != "POST") :

    $returnData = msg(0, 404, 'Page Not Found!');

elseif (
    !isset($data->name)
    || !isset($data->email)
    || !isset($data->password)
    || !isset($data->confirmPassword)
    || empty(trim($data->name))
    || empty(trim($data->email))
    || empty(trim($data->password))
    || empty(trim($data->confirmPassword))
) :

    $fields = ['fields' => ['name', 'email', 'password', 'confirmPassword']];
    $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);

// IF THERE ARE NO EMPTY FIELDS THEN-
else :

    $name = trim($data->name);
    $email = trim($data->email);
    $password = trim($data->password);
    $confirmPassword = trim($data->confirmPassword);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) :
        $returnData = msg(0, 422, 'Invalid Email Address!');

    elseif (strlen($password) < 8) :
        $returnData = msg(0, 422, 'Your password must be at least 8 characters long!');

    elseif (strlen($name) < 3) :
        $returnData = msg(0, 422, 'Your name must be at least 3 characters long!');

    elseif ($password != $confirmPassword) :
        $returnData = msg(0, 422, 'Your password and confirmPassword must match!');

    else :
        try {
            $check_email_stmt_query = "SELECT * FROM " . $db_table . " WHERE email = '" . $email . "'";
            $check_email_stmt = $db->query($check_email_stmt_query);

            if ($check_email_stmt->num_rows) :
                $returnData = msg(0, 422, 'This E-mail already in use!');

            else :
                $insert_query = "INSERT INTO " . $db_table . " SET name = '" . $name . "', email = '" .  $email . "', password = '" . password_hash($password, PASSWORD_DEFAULT) . "'";
                $db->query($insert_query);
                $returnData = msg(1, 201, 'You have successfully registered.');

            endif;
        } catch (PDOException $e) {
            $returnData = msg(0, 500, $e->getMessage());
        }
    endif;
endif;

echo json_encode($returnData);