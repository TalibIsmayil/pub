const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const bcrypt = require('bcrypt');

//VALIDATION
const Joi = require('@hapi/joi');

const scheme = Joi.object({
    name: Joi.string().min(1).required(),
    groupName: Joi.string().min(1).required(),
    role: Joi.string().min(1).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});

const lessonScheme = Joi.object({
    name: Joi.string().min(1).required(),
    roomId: Joi.string().min(1).required(),
    image: Joi.string().min(1).required(),
    teacher: Joi.string().min(1).required(),
    hostUrl: Joi.string().min(6).required(),
    guestUrl: Joi.string().min(6).required(),
});

const scheme2 = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});

router.post('/register', async (req, res) => {
    const {error} = scheme.validate(req.body);
    if (error) return res.status(400).json({message: error.message});

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(403).json({message: 'Email already exists'
    });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        groupName: req.body.groupName,
        role: req.body.role,
        email: req.body.email,
        password: hashPassword
    });

    
    user.save().then(data => {
        res.json({name: data.name,message: 'Register successfully completed'});
    }).catch(err => {
        res.json(err);
    });
});

router.post('/add-lesson', async (req, res) => {
    const {error} = lessonScheme.validate(req.body);
    if (error) return res.status(400).json({message: error.message});

    const lesson = new Lesson({
        name: req.body.name,
        roomId: req.body.roomId,
        image: req.body.image,
        teacher: req.body.teacher,
        hostUrl: req.body.hostUrl,
        guestUrl: req.body.guestUrl
    });

    
    lesson.save().then(data => {
        res.json({message: 'Successfully added'});
    }).catch(err => {
        res.json(err);
    });
});

router.get('/lessons', async (req, res) => {
    const lessons = await Lesson.find({});
    res.json(lessons)
});

router.post('/login', async (req, res) => {
    const {error} = scheme2.validate(req.body);
    if (error) return res.status(400).json({message: error.message});

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(403).json({message: 'Email or password is wrong!'});

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(403).json({message: 'Invalid password'});

    const token = jwt.sign({_id: user._id}, 'myStrongSecret123',{
        expiresIn: '90d',
      });
    res.json({name: user.name,
        token: token,
        role: user.role,
        message: 'Successfully logged in'});
});


module.exports = router;