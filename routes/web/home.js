var express = require("express");
var sqlite3 = require("sqlite3").verbose();

var router = express.Router();
var User = require("../../models/user");
var Habit = require("../../models/habit");
var Book = require("../../models/book");
var CalendarEvent = require("../../models/event");
var Note = require("../../models/note");
const { json } = require("body-parser");

const db = new sqlite3.Database('Database.db');


router.get("/", function (req, res) {
  // console.log("hello I'm on the start page");
  res.render("home/index");
});

router.get("/home", function (req, res) {
  res.render("home/home");
});

router.get("/about", function (req, res) {
  res.render("home/about");
});

router.get("/login", function (req, res) {
  res.render("home/login");
});


router.get("/signup", function (req, res) {
  res.render("home/signup");
});


router.all("/calendar", function (req, res) {

  var userId = req.query.user_id;

  const AllHabitsQuery = "SELECT * FROM habits WHERE user_id = ?";
  const GetUserQuery = "SELECT * FROM users WHERE id=?";
  const NoteQuery = "SELECT * FROM notes notes WHERE user_id = ?";

  db.get(GetUserQuery, [userId], (err, row) => {
    if (err) {
      console.error("Błąd wyszukiwania usera:", err.message);
      return res.status(500).send("Wystąpił błąd podczas wyszukiwania usera.");
    }
    var user = row;


    var habitsList = [];
    db.all(AllHabitsQuery, [userId], (err, rows) => {
      if (err) {
        console.error("Błąd podczas pobierania nawyków:", err.message);
        return res.status(500).send("Wystąpił błąd podczas pobierania nawyków.");
      }
      rows.forEach((row) => {
        habitsList.push(row);
      });

      habit_tmp = new Habit();


      var noteDB;
      db.all(NoteQuery, [user.id], (err, rows) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        noteDB = rows;
        res.render("home/calendar", { user: user, habitsList: habitsList, habit_tmp: habit_tmp, note: noteDB });
      });
    });
  });
});



router.post("/signup", (req, res) => {
  const { surname, name, username, password } = req.body;

  User.findByUsername(username, (err, existingUser) => {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas przetwarzania żądania.");
    }

    if (existingUser) {
      return res.render("home/signup", { error: "Użytkownik o podanej nazwie już istnieje." });
    }

    const newUser = new User(id = 0, username, name, surname, password);
    newUser.save((err, userId) => {
      if (err) {
        return res.status(500).send("Wystąpił błąd podczas rejestracji użytkownika.");
      }
      res.redirect("/login");
    });
  });
});


router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas przetwarzania żądania.");
    }

    if (!user) {
      return res.render("home/login", { error: "Nieprawidłowa nazwa użytkownika lub hasło." });
    }

    user.checkPassword(password, (err, isMatch) => {
      if (err) {
        return res.status(500).send("Wystąpił błąd podczas autoryzacji.");
      }

      if (!isMatch) {
        return res.render("home/login", { error: "Nieprawidłowa nazwa użytkownika lub hasło." });
      }
      req.session.user = user;
      res.redirect("/calendar?user_id=" + req.session.user.id);

    });
  });
});


router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Błąd przy wylogowywaniu:", err);
      return res.status(500).send("Wystąpił błąd podczas wylogowywania.");
    }
    res.redirect("/");
  });
});


router.post("/habit", function (req, res) {

  if (!req.session.user || !req.session.user.id) {
    return res.status(400).send("Brak poprawnych danych użytkownika w sesji.");
  }

  const name = req.body.name;
  const userId = req.session.user.id;

  const newHabit = new Habit(name, 0, 0, 0, 0, 0, 0, 0, userId);
  newHabit.save(function (err, habitId) {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas dodawania nawyku.");
    }
    res.redirect("/calendar?user_id=" + userId);

  });
});

router.get("/habitDelete", (req, res) => {
  const habit_id = req.query.id;
  const userId = req.session.user.id;
  Habit.updateRecord(habit_id, 1, (err, userId) => {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas przetwarzania żądania.");
    }
  });
  res.redirect("/calendar?user_id=" + userId);
});


router.get("/checkboxUpdate", (req, res) => {
  const userId = req.session.user ? req.session.user.id : undefined;
  const habit_id = req.query.habitID;
  const day = req.query.day;
  console.log(day);
  console.log(habit_id);

  console.log(userId);

  Habit.checkboxUpdate(habit_id, 1, day, (err) => {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas przetwarzania żądania.");
    }
    else
      console.log("dupa 3 prawie prawie");
  });
  res.redirect("/calendar?user_id=" + req.session.user.id);
});


router.post("/event", function (req, res) {

  if (!req.session.user)
    return res.redirect("/login");

  const title = req.body.title;
  const start = req.body.start;
  const end = req.body.end;
  const category = req.body.category;
  const userId = req.session.user.id;

  const newEvent = new CalendarEvent(title, start, end, category, userId);
  newEvent.save(function (err, eventId) {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas dodawania nawyku.");
    }


  });
  res.redirect("/calendar?user_id=" + userId);
});

router.all("/eventGet", (req, res) => {
  if (!req.session.user)
    return res.redirect("/login");

  const user = req.session.user;
  const userId = user.id;

  const AllEventsQuery = "SELECT * FROM events WHERE user_id = ?";
  db.all(AllEventsQuery, [userId], (err, rows) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    for (let i = 0; i < rows.length; i++) {

      // rows[i].start += 'T00:00:00';
      // rows[i].end += 'T24:00:00';
      // rows[i].allDay = true;

      if (rows[i].category == 'task')
        rows[i].color = '#0084ff';
      else if (rows[i].category == 'event')
        rows[i].color = '#ffbb00';
      else if (rows[i].category == 'important')
        rows[i].color = '#dd0101';

    }
    res.json(rows);
  });
});





router.get("/eventDelete", (req, res) => {
  const event_id = req.query.eventId;
  const userId = req.session.user.id;
  CalendarEvent.updateRecord(event_id, 1, (err, userId) => {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas przetwarzania żądania.");
    }
    res.redirect("/calendar?user_id=" + userId);
  });
});

router.get("/addNote", (req, res) => {

  if (!req.session.user)
    return res.redirect("/login");

  const note = req.query.note;
  const noteId = req.query.noteId;
  const userId = req.session.user.id;

 Note.findNote(userId, (err, existingNote) => {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas sprawdzania notatki.");
    }

    if (existingNote) {
      Note.updateNote(noteId,note, (err, userId) => {
        if (err) {
          return res.status(500).send("Wystąpił błąd podczas przetwarzania żądania.");
        }
    
      });
      res.redirect("/calendar?user_id=" + userId);

    } else {
      const newNote = new Note(note, userId );
      newNote.save(function (err, noteId) {
        if (err) {
          return res.status(500).send("Wystąpił błąd podczas dodawania notatki.");
        }
        res.redirect("/calendar?user_id=" + userId);
      });
    }
  });
});




router.post("/bookshelf", function (req, res) {

  if (!req.session.user)
    return res.redirect("/login");

  const user = req.session.user;
  const title = req.body.title;
  const author = req.body.author;
  const note = req.body.note;
  const rating = req.body.rating;
  const user_id = req.session.user.id;


  const newBook = new Book(title, author, note, rating, user_id);
  newBook.save(function (err, bookId) {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas dodawania nawyku.");
    }
    // res.render("home/bookshelf", { user });
    res.redirect("/bookshelf?user_id=" + user_id);

  });
});


router.all("/bookshelf", function (req, res) {
  if (!req.session.user)
    return res.redirect("/login");

  const user = req.session.user;
  const userId = user.id;

  const AllBooksQuery = "SELECT * FROM books WHERE user_id = ?";
  var BooksList = [];
  db.all(AllBooksQuery, [userId], (err, rows) => {
    if (err) {
      console.error("Błąd podczas pobierania nawyków:", err.message);
      return res.status(500).send("Wystąpił błąd podczas pobierania nawyków.");
    }
    rows.forEach((row) => {
      BooksList.push(row);
    });

    book_tmp = new Book();
    res.render("home/bookshelf", { user, BooksList: BooksList, book_tmp: book_tmp });

  });
});

router.get("/bookDelete", (req, res) => {
  const book_id = req.query.bookId;
  const userId = req.session.user.id;
  Book.deleteBook(book_id, 1, (err, userId) => {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas przetwarzania żądania.");
    }
    res.redirect("/bookshelf?user_id=" + userId);
  });
});

router.post("/bookEdit", (req, res) => {

  if (!req.session.user)
    return res.redirect("/login");


  const book_id = req.body.bookId;
  const title = req.body.title;
  const author = req.body.author;
  const note = req.body.note;
  const rating = req.body.rating;
  const user_id = req.session.user.id;

  console.log(book_id);
  console.log(title);
  console.log(author);
  console.log(note);
  console.log(user_id);

  Book.editBook(book_id, title, author, note, rating, (err, user_id) => {
    if (err) {
      return res.status(500).send("Wystąpił błąd podczas przetwarzania żądania.");
    }
  });
  res.redirect("/bookshelf?user_id=" + user_id);
});

router.all("/5StarsBooks", function (req, res) {
  if (!req.session.user)
    return res.redirect("/login");

  const user = req.session.user;
  const userId = user.id;

  const AllBooksQuery = "SELECT * FROM books WHERE user_id = ? AND rating=5";
  var BooksList = [];
  db.all(AllBooksQuery, [userId], (err, rows) => {
    if (err) {
      console.error("Błąd podczas pobierania nawyków:", err.message);
      return res.status(500).send("Wystąpił błąd podczas pobierania nawyków.");
    }
    rows.forEach((row) => {
      BooksList.push(row);
    });

    book_tmp = new Book();
    res.render("home/bookshelf", { user, BooksList: BooksList, book_tmp: book_tmp });

  });
});

router.all("/4StarsBooks", function (req, res) {
  if (!req.session.user)
    return res.redirect("/login");

  const user = req.session.user;
  const userId = user.id;

  const AllBooksQuery = "SELECT * FROM books WHERE user_id = ? AND rating=4";
  var BooksList = [];
  db.all(AllBooksQuery, [userId], (err, rows) => {
    if (err) {
      console.error("Błąd podczas pobierania nawyków:", err.message);
      return res.status(500).send("Wystąpił błąd podczas pobierania nawyków.");
    }
    rows.forEach((row) => {
      BooksList.push(row);
    });

    book_tmp = new Book();
    res.render("home/bookshelf", { user, BooksList: BooksList, book_tmp: book_tmp });

  });
});

router.all("/3StarsBooks", function (req, res) {
  if (!req.session.user)
    return res.redirect("/login");

  const user = req.session.user;
  const userId = user.id;

  const AllBooksQuery = "SELECT * FROM books WHERE user_id = ? AND rating=3";
  var BooksList = [];
  db.all(AllBooksQuery, [userId], (err, rows) => {
    if (err) {
      console.error("Błąd podczas pobierania nawyków:", err.message);
      return res.status(500).send("Wystąpił błąd podczas pobierania nawyków.");
    }
    rows.forEach((row) => {
      BooksList.push(row);
    });

    book_tmp = new Book();
    res.render("home/bookshelf", { user, BooksList: BooksList, book_tmp: book_tmp });

  });
});

router.all("/2StarsBooks", function (req, res) {
  if (!req.session.user)
    return res.redirect("/login");

  const user = req.session.user;
  const userId = user.id;

  const AllBooksQuery = "SELECT * FROM books WHERE user_id = ? AND rating=2";
  var BooksList = [];
  db.all(AllBooksQuery, [userId], (err, rows) => {
    if (err) {
      console.error("Błąd podczas pobierania nawyków:", err.message);
      return res.status(500).send("Wystąpił błąd podczas pobierania nawyków.");
    }
    rows.forEach((row) => {
      BooksList.push(row);
    });

    book_tmp = new Book();
    res.render("home/bookshelf", { user, BooksList: BooksList, book_tmp: book_tmp });

  });
});

router.all("/1StarsBooks", function (req, res) {
  if (!req.session.user)
    return res.redirect("/login");

  const user = req.session.user;
  const userId = user.id;

  const AllBooksQuery = "SELECT * FROM books WHERE user_id = ? AND rating=1";
  var BooksList = [];
  db.all(AllBooksQuery, [userId], (err, rows) => {
    if (err) {
      console.error("Błąd podczas pobierania nawyków:", err.message);
      return res.status(500).send("Wystąpił błąd podczas pobierania nawyków.");
    }
    rows.forEach((row) => {
      BooksList.push(row);
    });

    book_tmp = new Book();
    res.render("home/bookshelf", { user, BooksList: BooksList, book_tmp: book_tmp });

  });
});

router.get("/pomodoro", function (req, res) {
  if (!req.session.user)
    return res.redirect("/login");

  const user = req.session.user;
  const userId = user.id;

  res.render("home/pomodoro", { user });

});



module.exports = router;