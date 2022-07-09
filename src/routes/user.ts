import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { checkLogin } from '../services/user';

const router = express.Router();

router.post('/login', async (req, res) => {
    const {user, password} = req.body;

    if(!user || !password) return res.status(422).send({
        error: 'Missing or invalid parameters'
    });

    const userLogged = await checkLogin(user,password);
    if(!userLogged) return res.status(401).send({
        error: 'Incorrect email or password'
    });

    const {userid, username} = userLogged;
    const token = jwt.sign({userid, username}, JWT_SECRET, {expiresIn: 3600});
    res.send({
        logged: true,
        token,
        userid
    })
})

export default router;