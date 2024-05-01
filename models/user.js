const bcrypt = require("bcryptjs");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('Database.db');

const SALT_FACTOR = 10;

class User {
  constructor(id,username,name,surname, password) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.password = password;
  }

  save(callback) {
    const user = this;
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
      if (err) return callback(err);
      bcrypt.hash(user.password, salt, (err, hashedPassword) => {
        if (err) return callback(err);
        user.password = hashedPassword;
        db.run(`INSERT INTO users (username,name,surname, password) VALUES (?,? ,?, ?)`, [user.username, user.name,user.surname, user.password], function(err) {
          callback(err, this.lastID);
        });
      });
    });
  }

  static findByUsername(username, callback) {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) return callback(err);
      callback(null, row ? new User(row.id,row.username, row.name,row.surname, row.password) : null);
    });
  }

  checkPassword(guess, callback) {
    if (this.password != null) {
      bcrypt.compare(guess, this.password, (err, isMatch) => {
        callback(err, isMatch);
      });
    }
  }
}

module.exports = User;
