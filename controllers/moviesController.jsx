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
    const moviesSql = 'SELECT * FROM movies WHERE id = ?'
    const reviewsSql = `SELECT 
    reviews.name AS reviewer,
    reviews.vote,
    reviews.text AS review_text,
    reviews.created_at AS posted_at,
    reviews.updated_at AS updated_at
FROM
    reviews WHERE id = ?`

    sqlConnect.query(moviesSql, [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database query error (Movie)'});
            if (results.length === 0) return res.status(404).json({ error: 'Movie not found'});
            const movie = results[0];

        sqlConnect.query(reviewsSql, [id], (err, results) => {
            if (err) return res.status(500).json({error: 'Database query error (reviews)'});
                movie.review = results[0];
                res.json(movie)
        });
    });
}

// post
function store(req, res) {

    const {title, director, genre, release_year, abstract, image} = req.body;
    const sql = `insert 
                into movies (title, director, genre, release_year, abstract, image)
                values (?, ?, ?, ?, ?, ?)`;
    sqlConnect.query(sql, [title, director, genre, release_year, abstract, image], (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to insert new movie' });
        res.status(201);
        console.log(results);
        res.json({id: results.resultsId})
        
    })

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

    sqlConnect.query('DELETE FROM movies WHERE id = ?', [id], 
        (err) => {if (err) return res.status(500).json({ error: 'Failed to delete movie'})});
        res.sendStatus(204)
};

module.exports = { index, show, store, update, patch, destroy } 