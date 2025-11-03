// import connessione al database
const sqlConnect = require('../data/db');
const setImagePath = require('../middlewares/imagePath');

// index
function index(req, res) {
    // stringa che computa mySQL nel DB
    const sql = 'SELECT * FROM movies';
    
    sqlConnect.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });   // catch error
    const movies = results
    movies.forEach(movie => {movie.image === '' ? movie.image = null : movie.image = req.imagePath + movie.image});
    res.json(movies);
})};

// show
function show(req, res) {
    const id = req.params.id;

    // stringhe che computa mySQL nel DB
    const moviesSql = 'SELECT * FROM movies WHERE id = ?'
    const reviewSql = `
    SELECT 
        reviews.name AS reviewer,
        reviews.vote,
        reviews.text AS review_text,
        reviews.created_at AS posted_at,
        reviews.updated_at AS updated_at
    FROM
        reviews 
    WHERE 
        id = ?`

    sqlConnect.query(moviesSql, [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database query error (Movie)'}); // catch error
            if (results.length === 0) return res.status(404).json({ error: 'Movie not found'});
            const movie = results[0];
            movie.image = req.imagePath + movie.image;  // utilizzo del middleWare imagePath per reindirizzare

        sqlConnect.query(reviewSql, [id], (err, results) => {
            if (err) return res.status(500).json({error: 'Database query error (reviews)'});    // catch error
                movie.review = results[0];  //  aggiunta un proprietá review in base a ció che é trovato nel DB
                res.json(movie)
        });
    });
}

// post
function store(req, res) {
    const {title, director, genre, release_year, abstract, image} = req.body;

    // stringa che computa mySQL nel DB
    const sql = `
    INSERT
    INTO movies
        (title, director, genre, release_year, abstract, image)
    VALUES
        (?, ?, ?, ?, ?, ?)`;

    sqlConnect.query(sql, [title, director, genre, release_year, abstract, image], (err, results) => {
        if (err) return res.status(500).json({  // catch error
            error: 'Failed to insert new movie',
            reminder: 'USE THESE COL NAMES: title, director, genre, release_year(numerb), abstract, image'});
        res.status(201);
        console.log(results);
        res.json({id: results.resultsId})
    })
}

// update
function update(req, res) {
    const {id} = req.params
    const {title, director, genre, release_year, abstract, image} = req.body;

    // stringa che computa mySQL nel DB
    const sql = `
    UPDATE movies 
    SET 
        title = ?,
        director = ?,
        genre = ?,
        release_year = ?,
        abstract = ?,
        image = ?
    WHERE
        id = ?`

    sqlConnect.query(sql, [title, director, genre, release_year, abstract, image, id], (err, results) => {
        if (err) return res.status(500).json({ // catch error
            error: 'Failed to update movie',
            reminder: 'USE THESE COL NAMES: title, director, genre, release_year(numerb), abstract, image'});
        if (results.insertId === 0) return res.status(404).json({ error: 'Movie not found'});
        res.status(202).json({ message: 'Movie updated correctly'})}
    );
}

// patch
function patch(req, res) {
    const id = req.params.id;
    const value = req.body;

    // stringa che computa mySQL nel DB
    const sql = `
    UPDATE movies 
    SET 
        ?
    WHERE
        id = ?`

    sqlConnect.query(sql, [value, id], (err, results) => {
        if (err) return res.status(500).json({  // catch error
            error: 'Failed to modify movie info/s',
            reminder: 'USE THESE COL NAMES: title, director, genre, release_year(numerb), abstract, image'});
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Movie not found'});
            console.log(results);
        res.status(202).json({ message: 'Movie info modified correctly'})}
    );

}

// delete
function destroy(req, res) {
    const { id } = req.params;

    // stringa che computa mySQL nel DB
    const sql =`
    DELETE 
    FROM
        movies
    WHERE
        id = ?`
    sqlConnect.query(sql, [id], 
        (err) => {if (err) return res.status(500).json({ error: 'Failed to delete movie'})});
        res.sendStatus(204)
};

module.exports = { index, show, store, update, patch, destroy } 