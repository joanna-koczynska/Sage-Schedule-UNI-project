const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('Database.db');

class CalendarEvent {
  constructor(title, start, end,category, user_id) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.category = category;
    this.user_id = user_id;
  }

  save(callback) {
    db.run('INSERT INTO events (title, start, end, category, user_id) VALUES (?, ?, ?, ?, ?)',
      [this.title,this.start, this.end, this.category, this.user_id],
      function (err) {
        if (err) {
          return callback(err);
        }
        callback(null, this.lastID);
      });
  }

  static updateRecord(id, newValues) {
    let sql = `UPDATE events SET is_del = ? WHERE id = ?`;

    db.run(sql, [newValues, id], (err) =>{
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Record with ID ${id} updated successfully`);
      }
    });
  }
  
}

module.exports = CalendarEvent;
