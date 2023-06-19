const express = require("express")
const router= express.Router()
const postsController=require("../controller/posts.controller")
//aa
router.get("/hastaneler", postsController.getallhospital)
router.get("/hastaneler/:id", postsController.getByIdHastane)

router.get("/doktorlar",postsController.getAlldocktors)
router.get("/doktorlar/:id", postsController.getByIdDoktors)

router.get("/branslar",postsController.getallbranches)
router.get("/branslar/:name",postsController.getByIdBranches)



// router.get("/:id", postsController.getById)
// router.post("/", postsController.create)
// router.put("/:id", postsController.update)
// router.delete("/:id", postsController.delete)

module.exports=router