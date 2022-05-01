<?php
class Book
{
    // dbection
    private $db;
    // Table
    private $db_table = "books";
    // Columns
    public $id;
    public $title;
    public $category;
    public $author;
    public $createdAt;
    public $bookUrl;


    // Db dbection
    public function __construct($db)
    {
        $this->db = $db;
    }

    // GET ALL
    public function getBooks()
    {
        $sqlQuery = $this->order_by == "title" ?
            "SELECT * FROM " . $this->db_table . " ORDER BY title ASC" :
            "SELECT * FROM " . $this->db_table . " ORDER BY createdAt DESC";
        $this->result = $this->db->query($sqlQuery);
        return $this->result;
    }

    // GET BOOK BY NAME
    public function getBookByName()
    {
        $sqlQuery = "SELECT * FROM " . $this->db_table . " WHERE title LIKE '%" . $this->title . "%' ORDER BY createdAt DESC";
        $this->result = $this->db->query($sqlQuery);
        return $this->result;
    }

    // CREATE
    public function createBook()
    {
        // sanitize
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->author = htmlspecialchars(strip_tags($this->author));
        $this->createdAt = htmlspecialchars(strip_tags($this->createdAt));
        $this->bookUrl = htmlspecialchars(strip_tags($this->bookUrl));

        $sqlQuery = "INSERT INTO
" . $this->db_table . " SET title = '" . $this->title . "',
category = '" . $this->category . "',
author = '" . $this->author . "',createdAt = '" . $this->createdAt . "',bookUrl = '" . $this->bookUrl . "'";
        $this->db->query($sqlQuery);
        if ($this->db->affected_rows > 0) {
            return true;
        }
        return false;
    }

    // DELETE
    function deleteBook()
    {
        $sqlQuery = "DELETE FROM " . $this->db_table . " WHERE id = " . $this->id;
        $this->db->query($sqlQuery);
        if ($this->db->affected_rows > 0) {
            return true;
        }
        return false;
    }
}

// create table query

// CREATE TABLE IF NOT EXISTS `Books` (
// `id` int(11) NOT NULL AUTO_INCREMENT,
// `title` varchar(256) NOT NULL,
// `category` varchar(50),
// `author` varchar(50) NOT NULL,
// `bookUrl` varchar(50) NOT NULL,
// `createdAt` datetime NOT NULL,
// PRIMARY KEY (`id`)
// )ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=19;