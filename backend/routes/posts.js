const express = require("express");
const multer = require("multer");
const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const Post = require('../models/post');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("", multer({ storage: storage }).single("image"), async (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename
        });
        await post.save().then(createdPost => {
            res.status(201).json({
                message: 'Post added successfully',
                post: {
                    ...createdPost,
                    id: createdPost._id,
                }
            });
        })

    } catch (error) {
        next(error);
    }
});

router.put("/:id", multer({ storage: storage }).single("image"),

    async (req, res, next) => {
        let imagePath = req.body.imagePath;
        // console.log(req.file);
        if (req.file) {
            const url = req.protocol + '://' + req.get("host");
            imagePath = url + "/images/" + req.file.filename
        }
        //try
        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath
        });
        console.log(post);
        Post.updateOne({ _id: req.params.id}, post).then(result =>{
            res.status(200).json({message: "Update successful!"});
        });
        // try {
        //     const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        //     if (!post) {
        //         return res.status(404).json({ message: 'Post not found' });
        //     }
        //     res.status(200).json({ message: "Update Successful", post });
        // } catch (error) {
        //     next(error);
        // }
    });

router.get("", async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            message: 'Posts successfully fetched',
            posts: posts
        });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(484).json({ message: 'Post not Found!' });
        }
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
