import axiosWithAuth from "./axiosWithAuth.js";

let page = 0;

const getAllBooks = async () => {
  const res = await axios.get("http://localhost/lms/api/getAllBooks.php");
  appendData(res);
};

const searchBook = async () => {
  try {
    const title = document.getElementById("search-keyword").value;
    const books = await axios.get(
      `http://localhost/lms/api/searchBook.php?title=${title}`
    );
    appendData(books);
  } catch (error) {
    document.getElementById("alert").classList.remove("alert-message");

    document.getElementById("alert").classList.remove("alert-message");
    document.getElementById("alert").classList.remove("alert-success");
    document.getElementById("alert").classList.add("alert-danger");
    document.getElementById("alert").innerHTML =
      "Sorry, We don't have that book!";
  } finally {
    setTimeout(() => {
      document.getElementById("alert").classList.add("alert-message");
    }, 2000);
  }
};

const appendData = (res) => {
  const data = JSON.parse(`{"body` + res.data.split(`{"body`)[1]);
  localStorage.setItem("books", JSON.stringify(data.body));
  document.getElementById("count").innerText = `Total Count: ${data.itemCount}`;
  const tableBody = document.getElementsByTagName("tbody")[0];
  let allBooksRow = ``;
  data.body.slice(0, 7).forEach((book, index) => {
    allBooksRow += `<tr>
              <th scope="row">${index + 1}</th>
              <td id=${book.bookUrl} onclick=openUrl(this)>${book.title}</td>
              <td>${book.category}</td>
              <td>${book.author}</td>
              <td>${book.createdAt}</td>
              <td><i class="bi bi-trash delete" id=${
                book.id
              } onclick="deleteBook(this)"></i></td>
            </tr>`;
  });

  tableBody.innerHTML = allBooksRow;
};
const openUrl = (book) => {
  if (book.id) {
    console.log(book.id);
    window.open(`${book.id}`, "_blank");
  }
};

const deleteBook = async (book) => {
  try {
    const res = await axios.post(
      `http://localhost/lms/api/deleteBook.php?id=${book.id}`
    );
    document.getElementById("alert").classList.remove("alert-message");
    document.getElementById("alert").classList.add("alert-danger");
    document.getElementById("alert").classList.remove("alert-success");
    document.getElementById("alert").innerHTML = "Successfully deleted a book!";
  } catch (error) {
    document.getElementById("alert").classList.remove("alert-message");
    document.getElementById("alert").classList.remove("alert-success");
    document.getElementById("alert").classList.add("alert-danger");
    document.getElementById("alert").innerHTML = "Failed deleting a book.";
  } finally {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

const handleNextPage = () => {
  if (page < 1) {
    document.getElementById("previous").removeAttribute("disabled");
  }
  const data = JSON.parse(localStorage.getItem("books"));
  const tableBody = document.getElementsByTagName("tbody")[0];
  let allBooksRow = ``;
  data.slice((page + 1) * 7, (page + 2) * 7).forEach((book, index) => {
    allBooksRow += `<tr>
              <th scope="row">${(page + 1) * 7 + index + 1}</th>
              <td>${book.title}</td>
              <td>${book.category}</td>
              <td>${book.author}</td>
              <td>${book.createdAt}</td>
               <td><i class="bi bi-trash delete" id=${
                 book.id
               } onclick="deleteBook(this)"></i></td>
            </tr>`;
    tableBody.innerHTML = allBooksRow;
  });
  page++;
};

const handlePreviousPage = () => {
  if (page === 0) {
    return;
  }
  if (page === 1) {
    document.getElementById("previous").setAttribute("disabled", true);
  }
  const data = JSON.parse(localStorage.getItem("books"));
  const tableBody = document.getElementsByTagName("tbody")[0];
  let allBooksRow = ``;
  data.slice(page * 7, (page + 1) * 7).forEach((book, index) => {
    allBooksRow += `<tr>
              <th scope="row">${(page - 1) * 7 + index + 1}</th>
              <td>${book.title}</td>
              <td>${book.category}</td>
              <td>${book.author}</td>
              <td>${book.createdAt}</td>
               <td><i class="bi bi-trash delete" id=${
                 book.id
               } onclick="deleteBook(this)"></i></td>
            </tr>`;
    tableBody.innerHTML = allBooksRow;
  });
  page--;
};

const createBook = async () => {
  try {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const category = document.getElementById("category").value;
    const bookUrl = document.getElementById("bookUrl").value;
    await axios.post("http://localhost/lms/api/createBook.php", {
      title,
      author,
      category,
      bookUrl,
    });
    document.getElementById("alert").classList.remove("alert-message");
    document.getElementById("alert").classList.add("alert-success");
    document.getElementById("alert").classList.remove("alert-danger");
    document.getElementById("alert").innerHTML = "Successfully created a book!";
  } catch (error) {
    document.getElementById("alert").classList.remove("alert-message");
    document.getElementById("alert").classList.remove("alert-success");
    document.getElementById("alert").classList.add("alert-danger");
    document.getElementById("alert").innerHTML = "Failed creating a book.";
  } finally {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

const handleSortByDate = async () => {
  const res = await axios.get(
    "http://localhost/lms/api/getAllBooks.php?order_by=date"
  );
  appendData(res);
};
const handleSortByTitle = async () => {
  const res = await axios.get("http://localhost/lms/api/getAllBooks.php");
  appendData(res);
};

// event listeners

if (document.getElementById("submit")) {
  document.getElementById("submit").addEventListener("click", createBook);
}
if (document.getElementById("search")) {
  document.getElementById("search").addEventListener("click", searchBook);
}
if (document.getElementById("next")) {
  document.getElementById("next").addEventListener("click", handleNextPage);
}
if (document.getElementById("previous")) {
  document
    .getElementById("previous")
    .addEventListener("click", handlePreviousPage);
}
if (document.getElementById("sortByDate")) {
  document
    .getElementById("sortByDate")
    .addEventListener("click", handleSortByDate);
}
if (document.getElementById("sortByTitle")) {
  document
    .getElementById("sortByTitle")
    .addEventListener("click", handleSortByTitle);
}

const init = async () => {
  if (
    window.location.pathname === "/index.html" ||
    window.location.pathname === "/"
  ) {
    const token = JSON.parse(localStorage.getItem("token"));
    const data = await axiosWithAuth(token).post(
      "http://localhost/lms/api/verify.php"
    );
    if (data.data.success) {
      localStorage.setItem("user", JSON.stringify(data.data.user));
      getAllBooks();
    } else {
      window.location = "/login.html";
    }
  }
};

init();

const addBooks = async () => {
  const titles = [
    "Communication Skills",
    "Elements of Civil Engineering",
    "Elements of Mechanical Engineering",
    "Mechanics of Solids",
    "Workshop",
    "Calculus",
    "Contributor Personality Development",
    "Computer Programming And Utilization",
    "Elements of Mechanical Engineering",
    "Physics",
    "Calculus",
    "Basic Electronics",
    "Contributor Personality Development",
    "English",
    "Basic Electrical Engineering",
    "Environmental Sciences",
    "Engineering Graphics & Design",
    "Mathematics - 2",
    "Induction Program",
    "Advanced Engineering Mathematics",
    "Data and File Structures",
    "Basic Electronics",
    "Advance Engineering Mathematics",
    "Design Engineering I-A",
    "Database Management Systems",
    "Effective Technical Communication",
    "Indian Constitution",
    "Data Structures",
    "Digital Fundamentals",
    "Management-I",
    "Object Oriented Analysis Design And Uml",
    "Object Oriented Programming with C++",
    "Design Engineering - I B",
    "Object Oriented Programming With C++",
    "Computer Organization",
    "Design Engineering 1 B",
    "Computer Organization & Architecture",
    "Principles of Economics and Management",
    "Management - II",
    "Object Oriented Programming With Java",
    "Visual Basic Applications and Programming",
    "E-Commerce & E-Business",
    "Institute Elective - Cyber Security",
    "Analysis and Design of Algorithms",
    "System Programming",
    "Design Engineering - II A",
    "Integrated Personality Development Course",
    "Professional ethics",
    "Cyber Security",
    "Formal Language and Automata Theory",
    "Computer Graphics and Visualization",
    "Software Engineering",
    "Computer Graphics",
    "Web Technology and Programming",
    "Software Engineering",
    "Web Technology",
    "Distributed operating system",
    "Data Compression and data Retrival",
    "Design Engineering II B",
    "Integrated Personality Development Course",
    "Software Engineering",
    "Big Data Analytics",
    "Enterprise Application Development",
    "Advanced Web Programming",
    "Data Analysis and Visualization",
    "Mobile Computing",
    "Advance Java Technology",
    "Data warehousing and Data Mining",
    "Software Project Management",
    "Enterprise Resource Planning",
    "Project - I",
    "Information and Network Security",
    "Mobile Computing and Wireless Communication",
    "Service Oriented Computing",
    "Distributed DBMS",
    "Data Mining and Business Intelligence",
    "Big Data Analytics",
    "Information Retrieval",
    "Wireless Communication",
    "Agile Development and UI/UX design",
    "Virtual and Augment Reality",
    "Computer Vision",
    "Internetwork Security and Web Analytics",
    "Blockchain",
    "Advance Computer Networks",
    "Android Programming",
    "Design And Analysis Of Algorithm",
    "Project - II",
    "Artificial Intelligence",
    "IOT and Applications",
    "Python Programming",
    "Cloud Infrastructure and Services",
    "Web data Management",
    "iOS Programming",
    "Android Programming",
    "Project (Phase-II)",
    "Mutlimedia and Animation",
  ];

  const books = titles.map((title) => ({
    title,
    author: "Admin",
    category: "Engineering",
  }));

  for (let i = 0; i < books.length; i++) {
    await axios.post("http://localhost/lms/api/createBook.php", {
      title: books[i].title,
      author: books[i].author,
      category: books[i].category,
      bookUrl: "",
    });
  }
};

// addBooks();

// Auth Functions

const signup = async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassowrd").value;
  if (name && email && password && confirmPassword) {
    const data = await axios.post("http://localhost/lms/api/signup.php", {
      name,
      email,
      password,
      confirmPassword,
    });
    if (data.data.status === 422) {
      document.getElementById("alert").classList.remove("alert-message");
      document.getElementById("alert").classList.remove("alert-success");
      document.getElementById("alert").classList.add("alert-danger");
      document.getElementById("alert").innerHTML = data.data.message;
      setTimeout(() => {
        document.getElementById("alert").classList.add("alert-message");
      }, 2000);
    }
    if (data.data.status === 201) {
      window.location = "/login.html";
    }
  }
};

const login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (email && password) {
    const data = await axios.post("http://localhost/lms/api/login.php", {
      email,
      password,
    });
    if (data.data.status === 422) {
      document.getElementById("alert").classList.remove("alert-message");
      document.getElementById("alert").classList.remove("alert-success");
      document.getElementById("alert").classList.add("alert-danger");
      document.getElementById("alert").innerHTML = data.data.message;
      setTimeout(() => {
        document.getElementById("alert").classList.add("alert-message");
      }, 2000);
    }
    if (data.data.success) {
      localStorage.setItem("token", JSON.stringify(data.data.token));
      window.location = "/";
    }
  }
};

if (document.getElementById("signup")) {
  document.getElementById("signup").addEventListener("click", signup);
}
if (document.getElementById("login")) {
  document.getElementById("login").addEventListener("click", login);
}
