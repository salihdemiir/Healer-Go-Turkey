const pool = require("../database/index")
//a
const bcryptjs = require ("bcryptjs");

const hastaneController = {


    deletedImage: async (req, res) => {
        try {
            const { image_url } = req.body; // images_name'i body'den alıyoruz
            await pool.query("DELETE FROM hastane_images WHERE image_url = ?", [image_url]);

            console.log('Resim ve ilişkili verileri başarıyla silindi.');
            res.status(200).json({ message: 'Resim ve ilişkili verileri başarıyla silindi.' });
        } catch (error) {
            console.error('Hata:', error);
            res.status(500).json({ error: 'Bir hata oluştu.' });
        }
    },


    deletedBranch: async (req, res) => {
        try {
            const {branches_id} = req.body;
            await pool.query("DELETE FROM doktorbranches WHERE branches_id = ?" , [branches_id]);
            await pool.query("DELETE FROM docktor_images WHERE branches_id = ?", [branches_id]);
            await pool.query("DELETE FROM hastane_images WHERE branches_id = ?" , [branches_id]);
            await pool.query("DELETE FROM branches WHERE id = ?" ,[branches_id]);

            console.log('Şube ve ilişkili verileri başarıyla silindi.');
            res.status(200).json({ message: 'Şube ve ilişkili verileri başarıyla silindi.' });
        } catch (error) {
            console.error('Hata:', error);
            res.status(500).json({ error: 'Bir hata oluştu.' });
        }
    },

    deletedocktor: async (req, res) => {

        try {
            const {docktor_id} = req.body;
            await pool.query("DELETE FROM docktor_images WHERE docktor_id = ?", [docktor_id]);
            await pool.query("DELETE FROM doktor_yorumlar WHERE doktor_id= ?", [docktor_id]);
            await pool.query("DELETE FROM usersmessages WHERE docktor_id =? OR gönderen_id = ?", [docktor_id,docktor_id]);
            await pool.query("DELETE FROM users where id=?",[docktor_id])

            console.log('Doktor ve ilişkili verileri başarıyla silindi.');
            res.status(200).json({ message: 'Doktor ve ilişkili verileri başarıyla silindi.' });
        } catch (error) {
            console.error('Hata:', error);
            res.status(500).json({ error: 'Bir hata oluştu.' });
        }
    },
    listbranchesphoto: async (req, res) => {
        try {
            const { userId,branches_id} = req.body
            const sql = "select * from hastane_images hi where hi.hastane_id =? and hi.branches_id=?"
            const [rows, fields] = await pool.query(sql, [userId,branches_id])

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



    listphoto: async (req, res) => {
        try {
            const { userId } = req.user;
            const sql = "select * from hastane_images hi where hi.hastane_id =? and hi.branches_id is null"
            const [rows, fields] = await pool.query(sql, [userId])

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
    addphoto: async (req, res) => {
        try {
            const { image,branches_id} = req.body
            const { userId } = req.body;
            const sql = "INSERT INTO hastane_images (hastane_id, image_url, branches_id) VALUES(?, ?, ?);"
            const [rows, fields] = await pool.query(sql, [userId,image,branches_id])

            if (rows.affectedRows) {
                return res.status(200).json({ message: "resim Kaydedildi" })
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

    hastane_mesajlarim: async (req, res) => {//aktif mesajları gösterir hastanın sildiği görünmez
        try {
            const {hasta_id}=req.body;//tıklanılan id soldaki doktorlarım menüsünden docktor_id
            const { userId } = req.body;
            const sql = ("select *  from usersmessages u where hasta_id =? and u.docktor_id =? and u.isactive=1 ORDER BY gönderim_zamanı ASC;");
            const [rows, fields] = await pool.query(sql, [hasta_id,userId])
            if(rows.length === 0) { // veritabanından sonuç gelmezse
                return res.status(401).json({ message: "Hastaya ait mesajlaşma kayıtları bulunamadı" }); // hata mesajı gönder
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            console.log(error);
            res.status(401).json({ status: (401), message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }
        
    },
    hastane_mesaj_gonder: async (req, res) => {
        try {
            const { messages, patient_id } = req.body;//tıklanılan hasta id sol menüden
            const { userId } = req.user;
            const sql = "insert into usersmessages (messages,hasta_id,isactive,docktor_id,gönderen_id,gönderim_zamanı) values (?,?,1,?,?,sysdate())"
            const [rows, fields] = await pool.query(sql, [messages, patient_id, userId, userId])
            if (rows.length === 0) { // veritabanından sonuç gelmezse
              return res.status(401).json({ status: "error", message: "Doktora ait mesajlaşma kayıtları bulunamadı" }); // hata mesajı gönder
            }
            else {
                return res.status(200).json({ status: "succes", message: "Mesaj Başarıyla gönderildi" });
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            console.log(error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }

    },

    getAllclients: async (req, res) => {
        try {
            const { userId } = req.user;//bu kısımda userıd hastane id olarak login authorize kısmından alınıyor
            const sql= "SELECT * FROM users u join usershastane u2 on u.id =u2.users_id  where u.role='client' and u2.hastane_id=? and u2.docktor_id=?"
            const [rows, fields] = await pool.query(sql, [userId,userId])
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
    updateusers: async (req, res) => {
        try {
            const { email, password, username } = req.body
            const [user, ] = await pool.query("select * from users where email = ?", [email])
            if (user[0]) return res.status(403).json({ error: "Email already exists!" })
            const hash = await bcryptjs.hashSync(password, 10);
            const { id } = req.body//tıklanılan user id
            const sql = "UPDATE users SET email=?, password=?, username=? WHERE id= ? ;"
            const [rows, fields] = await pool.query(sql, [email, hash, username,id])
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
    getAlldocktor: async (req, res) => {
        try {
            const { userId } = req.user;
            const { username } = req.user;
            const [rows, fields] = await pool.query("select u.username ,u.`role`,d.tag ,d.content ,d.image ,h.name  from users u join doktorinfo d on u.id =d.docktor_id join hastaneler h on d.hospital_id =h.id where d.isactive =1 and h.name=?", [username]);
            
            if(rows.length === 0) { // veritabanından sonuç gelmezse
                res.status(401).json({ status: "error", message: "Doktor Bulunamadı!" }); // hata mesajı gönder
            }
    
            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            console.log(error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }
    },
    createdocktor: async (req, res) => {
        try {
            const { email, password, username ,tag,content,image} = req.body
            const { userId } = req.user;
            const [user, ] = await pool.query("select * from users where email = ?", [email])
            if (user[0]) return res.status(401).json({ error: "Email already exists!" })
            
        const salt = await bcryptjs.genSaltSync(8);
        const hash = await bcryptjs.hashSync(password, salt);
            //userın oluşturulması
            const sql1 = "insert into users (email, password, username,role) values (?, ?, ?,'docktor')"
            const [rows, fields] = await pool.query(sql1, [email, hash, username])
            //doktor detay bilgilerinin oluşturulması
            const sql2 = "INSERT INTO doktorinfo (hospital_id, docktor_id, tag, content, isactive, image) VALUES (?, (select u.id from users u where u.username =?), ?, ?, 1, ?);"
            const [rows2, fields2] = await pool.query(sql2, [userId, username, tag,content,image])
            if (rows.affectedRows && rows2.affectedRows) {
                return res.status(200).json({ message: "Doktor Kaydedildi" })
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
    gethospitalbranches: async (req, res) => {
        try {
            const { userId } = req.user;//bu kısımda userıd hastane id olarak login authorize kısmından alınıyor
            const sql= "select * from branches b where b.hastane_id =?"
            const [rows, fields] = await pool.query(sql, [userId])
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
    createbranches: async (req, res) => {
        try {
            const { name,image , branches_id} = req.body
            const { userId } = req.user;
            const sql = "INSERT INTO branches (id, parent_id, name, hastane_id, isactive, image) VALUES((select count(*)+1 from branches b), ?, ?, ?, 1, ?);"
            const [rows, fields] = await pool.query(sql, [ branches_id,name,userId,image])

            if (rows.affectedRows) {
                return res.status(200).json({ message: "Branş Kaydedildi" })
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
    updatebranches: async (req, res) => {
        try {
            const { name,image,tıklanılan_id} = req.body
            const { userId } = req.user;
            const sql = "UPDATE branches SET parent_id=0, name=?, hastane_id=?, isactive=1, image=? WHERE id=?;"//sondaki ıd tıklanılan branchid
            const [rows, fields] = await pool.query(sql, [name,userId,image,tıklanılan_id])
            if (rows.affectedRows) {
                return res.status(200).json({ message: "Branş Başarıyla Güncellendi " })
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

    updatedocktors: async (req, res) => {
        try {
            const { email, password, username,tag ,content,image} = req.body
            const [user, ] = await pool.query("select * from users where email = ?", [email])
            if (user[0]) return res.status(401).json({ error: "Email already exists!" })
            const hash = await bcryptjs.hashSync(password, 10);
            const { id } = req.body//tıklanılan user id
            const sql = "UPDATE users SET email=?, password=?, username=? WHERE id= ? ;"
            const [rows, fields] = await pool.query(sql, [email, hash, username,id])
            const sql1 = "UPDATE doktorinfo SET docktor_id=?, tag=?, content=?,  image=? WHERE docktor_id=?;"
            const [rows1, fields1] = await pool.query(sql1, [id, tag, content,image,id])
            if (rows.affectedRows && rows1.affectedRows) {
                return res.status(200).json({ message: "Doktor Güncellendi" })
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
    updatehastane: async (req, res) => {
        try {
            const { email, password, username,adress,image,lat,lng,description } = req.body
            const [user, ] = await pool.query("select * from users where email = ?", [email])
            if (user[0]) return res.status(401).json({ error: "Email already exists!" })
            const hash = await bcryptjs.hashSync(password, 10);
            const { id } = req.body// user id login olan hastanenin
            const sql1 = "UPDATE users SET email=?, password=?, username=? WHERE id=?;"
            const [rows1, fields1] = await pool.query(sql1, [email, hash, username,id])

            const sql = "update hastaneler set  name = ? ,adress = ?, lat = ? , lng = ? ,image=?, description=?  where id = ? "
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
}

module.exports = hastaneController