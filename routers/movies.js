// import di express e proprietá di routing
const express = require('express');
const router = express.Router();

// const posts = require('../data/postsList');
const moviesController = require('../controllers/moviesController.jsx')

// index
router.get('/', moviesController.index)

// show
router.get('/:id', moviesController.show)

// store
router.post('/', moviesController.store)

// update
router.put('/:id', moviesController.update)

// patch
router.patch('/:id', moviesController.patch)

// delete
router.delete('/:id', moviesController.destroy)

module.exports = router;