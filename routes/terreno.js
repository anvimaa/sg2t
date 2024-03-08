const express = require("express");
const router = express.Router();

router.get("/page",(req,res)=>{
    res.render("terreno")
})

module.exports = router;
