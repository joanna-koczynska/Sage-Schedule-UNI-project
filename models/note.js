const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('Database.db');

class Note {
  constructor(note, user_id) {
    this.note = note;
    this.user_id = user_id;
  }

  save(callback) {
    console.log(this.note);
    db.run('INSERT INTO notes (note, user_id) VALUES (?, ?)',
      [this.note, this.user_id],
      function (err) {
        if (err) {
          return callback(err);
        }
        callback(null, this.lastID);
      });
  }

  static updateNote(id, newValues) {
    let sql = `UPDATE notes SET note = ? WHERE id = ?`;

    db.run(sql, [newValues, id], (err) =>{
      if (err) {
        console.error(err.message);
      } 
    });
  }

  static findNote(user_id, callback) {
    db.get(`SELECT * FROM notes WHERE user_id = ?`, [user_id], (err, note) => {
      if (err) {
        callback(err, false);
        return;
      }
      const foundNote = note !== undefined && note !== null;
        callback(null, foundNote);
    });
  }
  
}

module.exports = Note;
