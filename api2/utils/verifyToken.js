const jwt = require('jsonwebtoken');
const http = require('http');

const  createError =require("../utils/error.js") ;

const verifyToken = (req, res, next) => {
  
let token = req.headers.authorization.split(" ")[1] || '';

// let token = req.headers.cookie.split("=")[1] || ''

  if (!token) {
    return res.status(401).json({ error: "You are not authenticated!" });
  }

  jwt.verify(token, '3812932sjad34&*@', (err, decodedToken) => {
    if (err) return res.status(403).json({ error: "Token is not valid!" });
    req.user = decodedToken;
    console.log("req",req);
    next();
  });
};

const verifyTokenAndDoctor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role==='docktor'  || req.user.userId === req.params.id  ) {
      
      next();
    } else {
      res.status(403).json({ error: "yetkin yok" });

    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role==='admin'  || req.user.userId === req.params.id) {
      
      next();
    } else {
      res.status(403).json({ error: "yetkin yok" });

    }
  });
};
//aa
const verifyTokenAndClient = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role==='client'  || req.user.userId === req.params.id) {
      
      next();
    } else {
      res.status(403).json({ error: "yetkin yok" });

    }
  });
};


const verifyTokenAndHastane = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role==='hastane'  || req.user.userId === req.params.id) {
      
      next();
    } else {
      res.status(403).json({ error: "yetkin yok" });

    }
  });
};


module.exports = {verifyToken,verifyTokenAndDoctor,verifyTokenAndAdmin,verifyTokenAndClient,verifyTokenAndHastane}