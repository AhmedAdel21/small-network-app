const Post = require("../models/post");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/uploads/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

const upload = multer({ storage: storage });

router.post("", upload.single("image"), async (req, res, next) => {
  console.log("post request received");
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    imagePath: url + "/uploads/images/" + req.file.filename,
  });
  try {
    const savedPost = await post.save();
    console.log("post saved successfully");
    console.log("post", post);
    console.log("savedPost", savedPost);
    res.status(201).json({
      message: "Post added successfully",
      post: savedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Post addition failed",
    });
  }

  console.log(post);
});

router.get("", async (req, res, next) => {
  console.log("posts middleware running");
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Posts fetching failed",
    });
  }
});
router.delete("/:id", async (req, res, next) => {
  console.log("delete request received", req.params.id);
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Post deletion failed",
    });
  }
});
router.get("/:id", async (req, res, next) => {
  console.log("get request received", req.params.id);
  try {
    const post = await Post.findOne({ _id: req.params.id });
    res.status(200).json({
      message: "Post fetched successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Post deletion failed",
    });
  }
});
router.put("", async (req, res, next) => {
  console.log("put request received", req.body);
  try {
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      description: req.body.description,
    });

    const updatedPost = await Post.updateOne(
      { _id: post._id },
      { $set: { title: post.title, description: post.description } }
    );
    res.status(200).json({
      message: "Post updated successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Post update failed",
    });
  }
});
module.exports = router;
