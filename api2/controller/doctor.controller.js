const pool = require("../database/index")
const bcryptjs = require("bcryptjs")
const docktorController = {


    deletedImage: async (req, res) => {
        try {
            const { image_url } = req.body; // images_name'i body'den alıyoruz
            await pool.query("DELETE FROM docktor_images WHERE image_url = ?", [image_url]);

            ('Resim ve ilişkili verileri başarıyla silindi.');
            res.status(200).json({ message: 'Resim ve ilişkili verileri başarıyla silindi.' });
        } catch (error) {
            console.error('Hata:', error);
            res.status(500).json({ error: 'Bir hata oluştu.' });
        }
    },

    deletedBranch: async (req, res) => {
        try {
            const {branches_id} = req.body;
            await pool.query("DELETE FROM doktorbranches WHERE branches_id = ?",[branches_id]);

            ('Şube ve ilişkili verileri başarıyla silindi.');
            res.status(200).json({ message: 'Şube ve ilişkili verileri başarıyla silindi.' });
        } catch (error) {
            console.error('Hata:', error);
            res.status(500).json({ error: 'Bir hata oluştu.' });
        }
    },

    addphoto: async (req, res) => {
        try {
            const { image,branches_id} = req.body
            const { userId } = req.user;
            const sql = "INSERT INTO docktor_images(docktor_id, image_url, branches_id)VALUES(?, ?, ?);"
            const [rows, fields] = await pool.query(sql, [userId,image,branches_id])

            if (rows.affectedRows) {
                return res.status(200).json({ message: "resim Kaydedildi" })
            } else {
                return res.status(401).json({ error: "Error" })
            }
            sadasd

        } catch (error) {
            (error)
            res.status(401).json({
                error: error.message
            })
        }
    },
    listphoto: async (req, res) => {
        try {
            const { userId } = req.user;
            const sql = "select * from docktor_images di where di.docktor_id =? and di.branches_id is null"
            const [rows, fields] = await pool.query(sql, [userId])

            res.status(200).json({
                data: rows
            })
        } catch (error) {
            (error)
            res.status(401).json({
                status: "error"
            })
        }
    },
    listbranchesphoto: async (req, res) => {
        try {
            const { userId,branches_id} = req.body
            const sql = "select * from docktor_images di where di.docktor_id =? and di.branches_id=?"
            const [rows, fields] = await pool.query(sql, [userId,branches_id])

            res.status(200).json({
                data: rows
            })
        } catch (error) {
            res.status(401).json({
                status: "error"
            })
        }
    },

    insertdocktorbranches: async (req, res) => {
        try {
            const { branches_id } = req.body;
            const { userId } = req.user;//giriş yapan doktorun idsi
            const sql = "INSERT INTO doktorbranches (branches_id, docktor_id, isactive) VALUES(?, ?, 1);"
            const [rows, fields] = await pool.query(sql, [branches_id, userId])
            if (rows.affectedRows) {
                return res.status(200).json({ message: "Doktor bransı Kaydedildi" })
            } else {
                return res.status(401).json({ error: "Error" })
            }

        } catch (error) {
            (error)
            res.status(401).json({
                error: error.message
            })
        }
    },

    getdocktorsclient: async (req, res) => {
        try {
            const { userId } = req.user;
            const [rows, fields] = await pool.query("select u2.id,u2.email,u2.username,h.name,u2.role from usershastane u join users u2 on u.users_id=u2.id join hastaneler h on u.hastane_id =h.id where u.docktor_id = ?", [userId]);

            if (rows.length === 0) { // veritabanından sonuç gelmezse
                return res.status(401).json({ status: "error", message: "Doktor Hastası Bulunamadı" }); // hata mesajı gönder
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            (error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }
    },
    getdocktorinfo: async (req, res) => {
        try {
            const { userId } = req.user;
            const [rows, fields] = await pool.query("select tag,role,u.username,h.name,d.content   from   doktorinfo d join hastaneler h on  d.hospital_id = h.id join users u on  d.docktor_id = u.id join doktorbranches d2 on  d.docktor_id =d2.docktor_id where d.docktor_id =  ?", [userId]);

            if (rows.length === 0) { // veritabanından sonuç gelmezse
                return res.status(401).json({ status: "error", message: "Doktor Hakkında Bulunamadı!" }); // hata mesajı gönder
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            (error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }
    },

    updatedocktorinfo: async (req, res) => {
        try {

            const { email,password,username,tag, content ,userId } = req.body;
         
            const [user, ] = await pool.query("select * from users where email = ?", [email])
            if (user[0]) return res.status(401).json({ error: "Email already exists!" })
            const hash = await bcryptjs.hashSync(password, 10);
            const sql1 = "UPDATE users SET email=?, password=?, username=? WHERE id= ? ;"
            const [rows1, fields1] = await pool.query(sql1, [email, hash, username,userId])
            const sql = "update doktorinfo set tag = ?, content = ?  where docktor_id = ? "
            const [rows, fields] = await pool.query(sql, [tag, content, userId])
            if (rows.length === 0 && rows1.length===0) { // veritabanından sonuç gelmezse
                res.status(401).json({ status: "error", message: "Doktor Hakkında Bulunamadı!" }); // hata mesajı gönder
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            console.log(error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }
    },
    doktormesajlarim: async (req, res) => {//aktif mesajları gösterir hastanın sildiği görünmez
        try {
            const { hasta_id } = req.body;//tıklanınlan id doktorun tıkladığı hasta
            const { userId } = req.body;
            const sql = ("select * from usersmessages u where docktor_id =? and u.hasta_id=? and u.isactive=1 ORDER BY gönderim_zamanı ASC;");
            const [rows, fields] = await pool.query(sql, [userId, hasta_id])
            if (rows.length === 0) { // veritabanından sonuç gelmezse

               return res.status(401).json({ status: "error", message: "Hastaya ait mesajlaşma kayıtları bulunamadı" }); // hata mesajı gönder
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            (error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }

    },
    docktor_mesaj_gonder: async (req, res) => {
        try {
            const { messages, patient_id } = req.body;//tıklanılan hasta id sol menüden
            const { userId } = req.user;
            const sql = "insert into usersmessages (messages,hasta_id,isactive,docktor_id,gönderen_id,gönderim_zamanı) values (?,?,1,?,?,sysdate())"
            const [rows, fields] = await pool.query(sql, [messages, patient_id, userId, userId])
            if (rows.length === 0) { // veritabanından sonuç gelmezse
               return  res.status(401).json({ status: "error", message: "Doktora ait mesajlaşma kayıtları bulunamadı" }); // hata mesajı gönder
            }
            else {
               return res.status(200).json({ status: "succes", message: "Mesaj Başarıyla gönderildi" });
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            (error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }

    },
    createdocktoroperations: async (req, res) => {
        try {
            const { name, operation_date, operation_description, branch_id } = req.body
            const { userId } = req.user;
            const sql = "insert into doctoroperations (doctor_id,operation_name,operation_date,operation_description,branch_id) values ( ?, ?, ?, ? , ? )"
            const [rows, fields] = await pool.query(sql, [userId, name, operation_date, operation_description, branch_id])

            if (rows.affectedRows) {
                return res.status(200).json({ message: "Doktor Operasyonu Kaydedildi" })
            } else {
                return res.status(401).json({ error: "Error" })
            }


        } catch (error) {
            (error)
            res.status(401).json({
                error: error.message
            })
        }
    },

    getdocktorbranches: async (req, res) => {
        try {
            const { userId } = req.user;
            const [rows, fields] = await pool.query("select b.name as bname,d.branches_id ,b.hastane_id ,h.name as hname from doktorbranches d  join branches b on d.branches_id =b.id join hastaneler h on h.id =b.hastane_id  where d.docktor_id =  ?", [userId]);

            if (rows.length === 0) { // veritabanından sonuç gelmezse
                return res.status(401).json({ status: "error", message: "Doktor Hakkında Bulunamadı!" }); // hata mesajı gönder
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            (error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }
    },
    getallbranchesinhospital: async (req, res) => {
        try {
            const { userId } = req.body;
            const [rows, fields] = await pool.query("select * from branches b where b.hastane_id =(select d.hospital_id  from doktorinfo d where d.docktor_id=?)", [userId])
            res.status(200).json({
                data: rows
            })
        } catch (error) {
            (error)
            res.status(401).json({
                status: "error"
            })
        }
    },

}

module.exports = docktorController