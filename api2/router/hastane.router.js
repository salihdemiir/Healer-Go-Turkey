const express = require("express")
const router= express.Router()
const adminController=require("../controller/hastane.controller")
const {verifyTokenAndHastane} = require ("../utils/verifyToken.js");
const hastaneController = require("../controller/hastane.controller");


const multer = require('multer');

// Resim ekleme için
const upload = multer({ dest: '../client/public/photos' }); // Dosyanın kaydedileceği klasör yolu

router.post('/addphoto', upload.array('file'), (req, res) => {
  const files = req.files; // Yüklenen dosyaların bilgisi

  // Dosyalar başarıyla kaydedildiğinde geriye dosyaların adlarını döndür
  const fileNames = files.map(file => file.filename);
  res.json({ fileNames: fileNames });
});

//aa
router.get("/docktors", verifyTokenAndHastane,hastaneController.getAlldocktor)
router.post("/kullanicilar", verifyTokenAndHastane,hastaneController.getAllclients)
router.post("/createdocktor", verifyTokenAndHastane,hastaneController.createdocktor)
router.put("/updateuser", verifyTokenAndHastane,adminController.updateusers)
router.post("/createbranches", verifyTokenAndHastane,hastaneController.createbranches)
router.put("/updatebranches", verifyTokenAndHastane,hastaneController.updatebranches)
router.post("/branches", verifyTokenAndHastane,hastaneController.gethospitalbranches)
router.put("/updatedocktor", verifyTokenAndHastane,adminController.updatedocktors)
router.put("/updatehastane", verifyTokenAndHastane,hastaneController.updatehastane)
router.post("/mesajlarim", verifyTokenAndHastane,hastaneController.hastane_mesajlarim)
router.post("/mesajgonder", verifyTokenAndHastane,hastaneController.hastane_mesaj_gonder)
router.post("/addimg", verifyTokenAndHastane,hastaneController.addphoto)
router.post("/hastanephoto", verifyTokenAndHastane,hastaneController.listphoto)
router.post("/hastaneBranchesPhoto", verifyTokenAndHastane,hastaneController.listbranchesphoto)
router.post("/deletedocktor", verifyTokenAndHastane,hastaneController.deletedocktor)
router.post("/deletebranch", verifyTokenAndHastane,hastaneController.deletedBranch)
router.post("/deleteimage", verifyTokenAndHastane,hastaneController.deletedImage)
module.exports=router