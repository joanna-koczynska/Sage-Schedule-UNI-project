const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('Database.db');

class Habit {
  constructor(name, day1, day2, day3, day4, day5, day6, day7, user_id) {
    this.name = name;
    this.days = [day1, day2, day3, day4, day5, day6, day7];
    this.user_id = user_id;
  }

  save(callback) {
    db.run('INSERT INTO habits (name, day1, day2, day3, day4, day5, day6, day7,user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)',
      [this.name, ...this.days, this.user_id],
      function (err) {
        if (err) {
          return callback(err);
        }
        callback(null, this.lastID);
      });
  }

   static updateRecord(id, newValues) {
    let sql = `UPDATE habits SET is_del = ? WHERE id = ?`;

    db.run(sql, [newValues, id], (err) =>{
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Record with ID ${id} updated successfully`);
      }
    });
  }

  static checkboxUpdate(id, newValues, day) {
    const columnName = day;

    let sql = `UPDATE habits SET ${columnName} = ? WHERE id = ?`;
    db.run(sql, [newValues, id], (err) =>{
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${day} in habit with ID ${id} updated successfully`);
      }
    });

  }

}

module.exports = Habit;
