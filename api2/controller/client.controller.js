const pool = require("../database/index")
//aa
const clientController = {

    hastaneyorumyap: async (req, res) => {
        try {
            const {hastane_id}=req.body;
            const {yorum}=req.body;//tıklanılan doktor_id alması lazım
            const { userId } = req.user;
            const sql = "INSERT INTO  hastane_yorumlar (yorum, user_id, hastane_id, yorumzamanı) VALUES(?, ?, ?,sysdate())"
            const [rows, fields] = await pool.query(sql, [yorum, userId,hastane_id])
            if(rows.length === 0) { // veritabanından sonuç gelmezse
                return res.status(401).json({ status: "error", message: "Yorum gönderilemedi" }); // hata mesajı gönder
            }
            else{
                return res.status(200).json({ status: "succes", message: "Yorum Başarıyla gönderildi" });
            }

            res.status(401).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            console.log(error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }

    },

    doktorlarım: async (req, res) => {
        try {
            const { userId } = req.user;
            const [rows, fields] = await pool.query("select u.id ,  d.tag ,u.username ,u2.docktor_id,u2.hastane_id,h.name as hastanename from usershastane u2 join hastaneler h on u2.hastane_id=h.id  join users u on u2.docktor_id =u.id left join doktorinfo d on u2.docktor_id =d.docktor_id  where u2.users_id=?", [userId]);

            if(rows.length === 0) { // veritabanından sonuç gelmezse
                return res.status(401).json({ status: "error", message: "Hastanın Herhangi Bir Doktoru yoktur" }); // hata mesajı gönder
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            console.log(error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }

    },
    mesajlarim: async (req, res) => {//aktif mesajları gösterir hastanın sildiği görünmez
        try {
            const { docktor_id ,userId} = req.body;//tıklanılan id soldaki doktorlarım menüsünden docktor_id
            const sql = ("select *  from usersmessages u where hasta_id =? and u.docktor_id =? and u.isactive=1 ORDER BY gönderim_zamanı ASC;");
            const [rows, fields] = await pool.query(sql, [userId, docktor_id])
            if (rows.length === 0) { // veritabanından sonuç gelmezse
                return res.status(401).json({ message: "Hastaya ait mesajlaşma kayıtları bulunamadı" }); // hata mesajı gönder
            }

            res.status(200).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
            console.log(error);
            res.status(401).json({ status: (401), message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }

    },
    mesaj_gonder: async (req, res) => {
        try {
            const { messages, docktor_id } = req.body;//tıklanılan doktor_id alması lazım
            const { userId } = req.user;
            const sql = "insert into usersmessages (messages,hasta_id,isactive,docktor_id,gönderen_id,gönderim_zamanı) values (?,?,1,?,?,sysdate())"
            const [rows, fields] = await pool.query(sql, [messages, userId, docktor_id, userId])
            if (rows.length === 0) { // veritabanından sonuç gelmezse
                return res.status(401).json({ status: "error", message: "Hastaya ait mesajlaşma kayıtları gönderilemedi" }); // hata mesajı gönder
            }
            else {
                return res.status(200).json({ status: "succes", message: "Mesaj Başarıyla gönderildi" });
            }

            res.status(401).json({ data: rows }); // veritabanından dönen sonuçları gönder
        } catch (error) {
         
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }

    },
    doktorayorumyap: async (req, res) => {
        try {
            const { docktor_id } = req.body;
            const { yorum } = req.body;//tıklanılan doktor_id alması lazım
            const { userId } = req.user;
            const sql = "INSERT INTO doktor_yorumlar (yorum, user_id, doktor_id, yorumzamanı) VALUES(?, ?, ?,sysdate())"
            const [rows, fields] = await pool.query(sql, [yorum, userId, docktor_id])
            if (rows.length === 0) { // veritabanından sonuç gelmezse
                return res.status(401).json({ status: "error", message: "Yorum gönderilemedi" }); // hata mesajı gönder
            }
            else {
                return res.status(200).json({ status: "succes", message: "Yorum Başarıyla gönderildi" });
            }

           
        } catch (error) {
            console.log(error);
            res.status(401).json({ status: "error", message: "Veri Tabanından İsteğe Dönüş Alınamadı" }); // hata mesajı gönder
        }

    },

    hastaol: async (req, res) => {
        try {
            const { userId, hastane_id, docktor_id } = req.body;
            const [user] = await pool.query("SELECT * FROM usershastane u WHERE u.docktor_id = ? AND u.users_id = ?", [docktor_id, userId]);

            if (user.length > 0) {
                return; // Kaydı yapmadan fonksiyondan çık
            }

            const sql = "INSERT INTO usershastane (hastane_id, users_id, isactive, docktor_id) VALUES (?, ?, 1, ?);";
            const [rows, fields] = await pool.query(sql, [hastane_id, userId, docktor_id]);

            if (rows.affectedRows === 0) {
                console.log("Hastaya kayıt edilemedi");
            } else {
                console.log("Hasta Başarıyla Kaydedildi");
            }
        } catch (error) {
            console.log("Veri Tabanından İsteğe Dönüş Alınamadı:", error);
        }
        res.sendStatus(200); // Başarılı yanıt gönder
    }
}
module.exports = clientController