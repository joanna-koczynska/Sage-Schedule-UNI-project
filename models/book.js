const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('Database.db');

class Book {
  constructor(title, author, note, rating, user_id) {
    this.title = title;
    this.author = author;
    this.note = note;
    this.rating = rating;
    this.user_id = user_id;
  }

  save(callback) {
    db.run('INSERT INTO books (title, author, note, rating, user_id) VALUES (?, ?, ?, ?, ?)',
      [this.title,this.author, this.note, this.rating, this.user_id],
      function (err) {
        if (err) {
          return callback(err);
        }
        callback(null, this.lastID);
      });
  }

  static deleteBook(id, newValues) {
    let sql = `UPDATE books SET is_del = ? WHERE id = ?`;

    db.run(sql, [newValues, id], (err) =>{
      if (err) {
        console.error(err.message);
      } else {
        console.log(`book with ID ${id} delete successfully`);
      }
    });
  }

  static editBook(id, titleNew, authorNew, noteNew, ratingNew) {
    let sql = `UPDATE books SET title = ?, author=?, note=?, rating=? WHERE id = ?`;

    db.run(sql, [titleNew, authorNew, noteNew, ratingNew, id], (err) =>{
      if (err) {
        console.error(err.message);
      } else {
        console.log(`book with ID ${id} edit successfully`);
      }
    });
  }
  
}

module.exports = Book;
