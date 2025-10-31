// import connessione al database
const sqlConnect = require('../data/db')

// index
function index(req, res) {
    const sql = 'SELECT * FROM movies';

    sqlConnect.query(sql, (err, results) => {
if (err) return res.status(500).json({ error: 'Database query failed' });
res.json(results);
})};

// show
function show(req, res) {
    const id = req.params.id;
    const postsSql = 'SELECT * FROM movies WHERE id = ?'
    const sqlTags = `SELECT 
    reviews.name AS reviewer,
    reviews.vote,
    reviews.text AS review_text,
    reviews.created_at AS posted_at,
    reviews.updated_at AS updated_at
FROM
    reviews WHERE id = ?`

    sqlConnect.query(postsSql, [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database query error (post)'});
            if (results.length === 0) return res.status(404).json({ error: 'Post not found'});
            const post = results[0];

        sqlConnect.query(sqlTags, [id], (err, results) => {
            if (err) return res.status(500).json({error: 'Database query error (tags)'});
                post.review = results[0];
                res.json(post)
        });
    });
}

// post
function post(req, res) {
 
}

// update
function update(req, res) {

}

// patch
function patch(req, res) {


}

// delete
function destroy(req, res) {
    const { id } = req.params;

    sqlConnect.query('DELETE FROM posts WHERE id = ?', [id], 
        (err) => {if (err) return res.status(500).json({ error: 'Failed to delete post'})});
        res.sendStatus(204)
};

module.exports = { index, show, post, update, patch, destroy } 