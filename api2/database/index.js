const mysql = require('mysql2')

const url = require('url');

const dotenv = require('dotenv');

// dotenv konfigürasyonunu yap
dotenv.config();

// veritabanı URI'sini çözümle

// veritabanı bağlantısı
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  port: process.env.DB_PORT,
});
  

pool.getConnection((err, conn) => {
    if(err) console.log(err)
    console.log("db bağlandi")
})

module.exports = pool.promise()