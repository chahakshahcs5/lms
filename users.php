<?php
class User
{
    // dbection
    private $db;
    // Table
    private $db_table = "users";
    // Columns
    public $id;
    public $name;
    public $email;
    public $password;


    // Db dbection
    public function __construct($db)
    {
        $this->db = $db;
    }
}

// create table query

// CREATE TABLE `users` (
// `id` int(11) NOT NULL AUTO_INCREMENT,
// `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
// `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
// `password` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
// PRIMARY KEY (`id`),
// UNIQUE KEY `email` (`email`)
// ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;