const pool = require("../database/index")
const bcryptjs = require ("bcryptjs");

const adminController = {


    deleteHospital: async (req, res) => {
      
        try {
            const {hastane_id} = req.body;
            await pool.query("DELETE FROM hastane_images WHERE hastane_id = ?", [hastane_id]);
            await pool.query("DELETE FROM branches WHERE hastane_id = ?", [hastane_id]);
            await pool.query("DELETE FROM hastaneler WHERE id = ?", [hastane_id]);
            await pool.query("DELETE FROM users where id=?",[hastane_id]);


            console.log('Hastane ve ilişkili verileri başarıyla silindi.');
            res.status(200).json({ message: 'Hastane ve ilişkili verileri başarıyla silindi.' });
        } catch (error) {
            console.error('Hata:', error);
            res.status(500).json({ error: 'Bir hata oluştu.' });
        }
    },
    updateusers: async (req, res) => {
        try {
            const {username, email } = req.body
            const { id } = req.params
            const sql = "update users set username = ?, email = ? where id = ? "
            const [rows, fields] = await pool.query(sql, [username, email, id])
            res.status(200).json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({
                status: "error"
            })
        }
    }, 
    createhastane: async (req, res) => {
        try {
            const { email, password, username,adress,lat,lng,image,description} = req.body
            const [user, ] = await pool.query("select * from users where email = ?", [email])
            if (user[0]) return res.status(401).json({ error: "Email already exists!" })

            const salt = await bcryptjs.genSaltSync(8);
            const hash = await bcryptjs.hashSync(password, salt);
            //userın oluşturulması
            const sql1 = "insert into users (email, password, username,role) values (?, ?, ?,'hastane')"
            const [rows, fields] = await pool.query(sql1, [email, hash, username])
            const sql = "insert into hastaneler (id,name,adress,lat,lng,isactive,image, description) values ( (select u.id from users u where u.username =?),?,?,?,? , 1,?,?)"
            const [rows1, fields1] = await pool.query(sql, [username,username,adress,lat,lng,image,description])

            if (rows.affectedRows && rows1.affectedRows) {
                return res.status(200).json({ message: "Hastane Kaydedildi" })
            } else {
                return res.status(401).json({ error: "Error" })
            }

        } catch (error) {
            console.log(error)
            res.status(401).json({
                error: error.message
            })
        }
    },
    updatehastane: async (req, res) => {
        try {
            const { email, password, username,adress,image,lat,lng,description } = req.body
            const [user, ] = await pool.query("select * from users where email = ?", [email])
           // if (user[0]) return res.status(401).json({ error: "Email already exists!" })
           const salt = await bcryptjs.genSaltSync(8);
           const hash = await bcryptjs.hashSync(password, salt);
            const { id } = req.body// user id TIKLANILAN
            const sql1 = "UPDATE users SET email=?, password=?, username=? WHERE id=?;"
            const [rows1, fields1] = await pool.query(sql1, [email, hash, username,id])

            const sql = "UPDATE hastaneler set  name = ? ,adress = ?, lat = ? , lng = ? ,image=?, description=?  where id = ? "
            const [rows, fields] = await pool.query(sql, [ username,adress,lat,lng,image,description,id])

            if (rows.affectedRows && rows1.affectedRows) {
                return res.status(200).json({ message: "Hastane Güncellendi" })
            } else {
                return res.status(401).json({ error: "Error" })
            }

        } catch (error) {
            console.log(error)
            res.status(401).json({
                status: "error"
            })
        }
    },
    // deletehastane: async (req, res) => {
    //     try {
    //         const { id } = req.params
    //         const [rows, fields] = await pool.query("delete from hastaneler where id = ?", [id])
    //         res.json({
    //             data: rows
    //         })
    //     } catch (error) {
    //         console.log(error)
    //         res.json({
    //             status: "error"
    //         })
    //     }
    // },
    createbranches: async (req, res) => {
        try {
            const { doctor_id,name,operation_date,operation_description,branch_id} = req.body
            const sql = "insert into doctoroperations (doctor_id,operation_name,operation_date,operation_description,branch_id) values ( ?, ?, ?, ? , ? )"
            const [rows, fields] = await pool.query(sql, [doctor_id,name,operation_date,operation_description,branch_id])

            if (rows.affectedRows) {
                return res.status(200).json({ message: "Doktor Operasyonu Kaydedildi" })
            } else {
                return res.status(401).json({ error: "Error" })
            }
            sadasd
            
        } catch (error) {
            console.log(error)
            res.status(401).json({
                error: error.message
            })
        }
    },
}


module.exports = adminController