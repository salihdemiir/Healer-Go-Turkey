const express = require("express")
const router= express.Router()
const docktorController=require("../controller/doctor.controller")
const {verifyTokenAndDoctor} = require ("../utils/verifyToken.js");



const multer = require('multer');

// Resim ekleme için
const upload = multer({ dest: '../client/public/photos' }); // Dosyanın kaydedileceği klasör yolu

router.post('/addphoto', upload.array('file'), (req, res) => {
  const files = req.files; // Yüklenen dosyaların bilgisi

  // Dosyalar başarıyla kaydedildiğinde geriye dosyaların adlarını döndür
  const fileNames = files.map(file => file.filename);
  res.json({ fileNames: fileNames });
});

router.post("/hakkimda", verifyTokenAndDoctor,docktorController.getdocktorinfo)
router.post("/hastalarim",verifyTokenAndDoctor, docktorController.getdocktorsclient)
router.put("/updateinfo", verifyTokenAndDoctor,docktorController.updatedocktorinfo)
router.post("/mesajlarim", verifyTokenAndDoctor,docktorController.doktormesajlarim)
router.post("/mesajgonder", verifyTokenAndDoctor,docktorController.docktor_mesaj_gonder)
router.post("/operasyonekle", verifyTokenAndDoctor,docktorController.createdocktoroperations)
router.post("/branches", verifyTokenAndDoctor,docktorController.getdocktorbranches)
router.post("/addbranches", verifyTokenAndDoctor,docktorController.insertdocktorbranches)
router.post("/hastanebrans", verifyTokenAndDoctor,docktorController.getallbranchesinhospital)
router.post("/addimg", verifyTokenAndDoctor,docktorController.addphoto)
router.post("/doktorphoto", verifyTokenAndDoctor,docktorController.listphoto)
router.post("/operasyonphoto", verifyTokenAndDoctor,docktorController.listbranchesphoto)
router.post("/deletebranch", verifyTokenAndDoctor,docktorController.deletedBranch)
router.post("/deleteimage", verifyTokenAndDoctor,docktorController.deletedImage)
module.exports=router