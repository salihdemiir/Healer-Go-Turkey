const pool = require("../database/index")
const postsController = {
    //a
    getAlldocktors: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("SELECT d.docktor_id, s.email, s.username, d.tag, d.content,CASE WHEN di.image_url IS NOT NULL THEN di.image_url ELSE d.image END AS image_url FROM users s JOIN doktorinfo d ON s.id = d.docktor_id LEFT JOIN (SELECT docktor_id, MAX(image_url) AS image_url FROM docktor_images WHERE branches_id IS NULL GROUP BY docktor_id) di ON di.docktor_id = d.docktor_id;")
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
    getByIdDoktors: async (req, res) => {
        try {
          const { id } = req.params;
      
            // Doktor detayları sorgusu
            const [doktorRows, doktorFields] = await pool.query(
            "SELECT h.id as hospitalid,d.docktor_id,h.name as Hastane,d.tag,u.username ,u.email ,d.content ,d.image from users u join doktorinfo d on u.id=d.docktor_id JOIN hastaneler h ON d.hospital_id = h.id WHERE u.id = ?",
            [id]
            );
      
            // Yorumlar sorgusu
            const [yorumRows, yorumFields] = await pool.query(
            "SELECT dy.yorum, u.username, u.email, dy.doktor_id, dy.yorumzamanı FROM doktor_yorumlar dy JOIN users u ON dy.user_id = u.id WHERE dy.doktor_id = ? ORDER BY dy.yorumzamanı DESC",
            [id]
            );
            // Doktorun branşları sorgusu
            const [branchesRows, branchesFields] = await pool.query(
            "select b.name  from doktorbranches d join branches b on d.branches_id =b.id where d.docktor_id =?",
            [id]
            );
            // Doktorun Operasyonları sorgusu
            const [operationRows, operationFields] = await pool.query(
            "select d.id,d.operation_name ,d.operation_description ,d.operation_date ,b.name as UnitName from doctoroperations d  join branches b on b.id =d.branch_id where doctor_id =? ORDER BY d.operation_date  DESC;",
            [id]
            );
            // doktor photo
            const [photoRows, photoFields] = await pool.query(
                "select * from docktor_images di where di.docktor_id =? and di.branches_id is null",
                [id]
                );
            //branch photo
            const [branchphotoRows, branchphotoFields] = await pool.query(
                "select * from docktor_images di where di.docktor_id =? and di.branches_id  is not null",
                [id]
                );
        // Sonuçları ayrı JSON nesnelerinde döndür
        res.status(200).json({
            doktorDetay: doktorRows,
            yorumlar: yorumRows,
            doktorunbransları:branchesRows,
            doktorunOperasyonları:operationRows,
            doktorphoto:photoRows,
            doktorbranchphoto:branchphotoRows

        });
        } catch (error) {
            console.log(error);
            res.status(401).json({
                status: "error"
            });
        }
    },
    getallhospital: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("SELECT h.id, h.name, u.email, CASE WHEN hi.image_url IS NOT NULL THEN hi.image_url ELSE h.image END AS image_url FROM hastaneler h  JOIN users u ON h.id = u.id LEFT JOIN (SELECT hastane_id, MAX(image_url) AS image_url  FROM hastane_images  WHERE branches_id IS NULL GROUP BY hastane_id) hi ON hi.hastane_id = h.id;")
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
    getByIdHastane: async (req, res) => {//doktorun idsine göre doktoru listeleme
        try {
            const { id } = req.params
            //Hastane genel detaylar
            const [hastaneDetayrows, hastaneDetayfields] = await pool.query("select * from hastaneler h join users u on h.id=u.id  where u.id =?", [id])
            //Hastane branşlar unitler
            const [branslarrows, branslarfields] = await pool.query("SELECT b.name, CASE WHEN hi.image_url IS NOT NULL THEN hi.image_url ELSE b.image END AS image_url FROM hastaneler h JOIN branches b ON h.id = b.hastane_id  LEFT JOIN (SELECT branches_id, MAX(image_url) AS image_url FROM hastane_images GROUP BY branches_id) hi ON b.id = hi.branches_id WHERE h.id = ?;", [id])
            //hastanedeki doktorlar
            const [doktorlarrows, doktorlarfields] = await pool.query("SELECT d.docktor_id, d.tag, u.username, u.email, di.image_url FROM doktorinfo d LEFT JOIN users u ON d.docktor_id = u.id LEFT JOIN docktor_images di ON di.docktor_id = d.docktor_id WHERE d.hospital_id = ? AND di.branches_id IS null GROUP BY d.docktor_id, d.tag, u.username, u.email, di.image_url;", [id])
            //Hastane Yorumlar sorgusu
            const [yorumRows, yorumFields] = await pool.query(
                "select u.username ,u.email ,u.role,hy.yorum ,hy.yorumzamanı from hastane_yorumlar hy join users u on hy.user_id =u.id  where hy.hastane_id =? ORDER BY hy.yorumzamanı DESC",
                [id]
                );
            const  [fotoRows, fotoFields] = await pool.query( "select * from hastane_images hi where hi.hastane_id =? and hi.branches_id is null",[id])
          

            res.status(200).json({
                HastaneDetay: hastaneDetayrows,
                HastaneBranslar:branslarrows,
                HastaneDoktorlar:doktorlarrows,
                HastaneYorumlar:yorumRows,
                HastaneFoto:fotoRows,
               
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({
                status: "error"
            })
        }
    },
    getallbranches: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("SELECT DISTINCT b.name, b.parent_id,  CASE WHEN hi.image_url IS NOT NULL THEN hi.image_url ELSE b.image END AS image_url FROM branches b LEFT JOIN (SELECT branches_id, MAX(image_url) AS image_url FROM hastane_images GROUP BY branches_id) hi ON b.id = hi.branches_id; ")
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
    getByIdBranches: async (req, res) => {//doktorun idsine göre doktoru listeleme
        try {
            //burda name olarak kullandık tablo yapısından dolayı
            const {name}=req.params
            //Bransın detayları
            const [bransdetayrows, hastaneDetayfields] = await pool.query("select distinct name,parent_id ,image from branches b where b.name =?", [name])
            //Bransın olduğu hastaneler
            const [branshatanelerrows, branslarfields] = await pool.query("select  h.id, b.name,b.image as branşresim ,h.name ,h.adress,h.description as hastanedescription,h.image as hastaneresim from branches b join hastaneler h on b.hastane_id =h.id where b.name=?", [name])
            //Bransın sahip olduğu doktorlar
            const [bransdoktorlarrows, doktorlarfields] = await pool.query("select u.id , d2.tag ,u.username ,u.email ,d2.image  from doktorbranches d join branches b on b.id =d.branches_id join users u on u.id =d.docktor_id join doktorinfo d2 on d2.docktor_id =d.docktor_id  where b.name=?", [name])
         
            const [fotorows, fotofields] = await pool.query("select * from hastane_images hi right join branches b on hi.branches_id =b.id where b.name= ?", [name])

            res.status(200).json({
                BransDetay: bransdetayrows,
                BransHastaneler:branshatanelerrows,
                BransDoktorlar:bransdoktorlarrows,
                BransFoto:fotorows

            })
        } catch (error) {
            console.log(error)
            res.status(401).json({
                status: "error"
            })
        }
    },

}


module.exports = postsController