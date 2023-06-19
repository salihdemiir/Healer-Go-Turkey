const express = require("express")
const router= express.Router()
const clientController=require("../controller/client.controller")
const {verifyTokenAndClient} = require ("../utils/verifyToken.js");
//aa
router.post("/hastaneyorumyap",verifyTokenAndClient,clientController.hastaneyorumyap)
router.post("/doktorlarim",verifyTokenAndClient,clientController.doktorlarım)
router.post("/mesajlarim",verifyTokenAndClient,clientController.mesajlarim)
router.post("/mesajgonder",verifyTokenAndClient,clientController.mesaj_gonder)
router.post("/doktorayorumyap",verifyTokenAndClient,clientController.doktorayorumyap)
router.post("/hastaol",verifyTokenAndClient,clientController.hastaol)
module.exports=router