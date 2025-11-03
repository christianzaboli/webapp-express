// import connessione al database
const sqlConnect = require('../data/db');

// index
function index(req, res) {
    // stringa che computa mySQL nel DB
    const sql = 'SELECT * FROM movies';
    
    sqlConnect.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });   // catch error
    
    // utilizzo del middleWare imagePath per reindirizzare
    results.forEach(movie => {
        if (movie.image.search('https') === -1) { // check sul percorso se é giá esistente e preso da fuori progetto
            movie.image = movie.image === '' ? null : req.imagePath + movie.image
        }
    });
    res.json(results);
})};

// show
function show(req, res) {
    const id = req.params.id;

    // stringhe che computa mySQL nel DB
    const moviesSql = 'SELECT * FROM movies WHERE id = ?'
    const reviewSql = `
    SELECT 
        reviews.name,
        reviews.vote,
        reviews.text,
        reviews.created_at,
        reviews.updated_at
    FROM
        reviews 
    WHERE 
        id = ?`

    sqlConnect.query(moviesSql, [id], (err, movieResult) => {
            if (err) return res.status(500).json({ error: 'Database query error (Movie)'}); // catch error
            if (movieResult.length === 0) return res.status(404).json({ error: 'Movie not found'});
            const movie = movieResult[0];

            // utilizzo del middleWare imagePath per reindirizzare
            if (movie.image.search('https') === -1) {    // check sul percorso se é giá esistente e preso da fuori progetto
                movie.image = movie.image === '' ? null : req.imagePath + movie.image
            }; 

        sqlConnect.query(reviewSql, [id], (err, reviewResult) => {
            if (err) return res.status(500).json({error: 'Database query error (reviews)'});    // catch error
                movie.review = reviewResult[0];  //  aggiunta un proprietá review in base a ció che é trovato nel DB
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
        if (err) return res.status(400).json({  // catch error
            error: 'Failed to insert new movie',
            reminder: 'USE THESE COL NAMES: title, director, genre, release_year(numerb), abstract, image'});
        res.status(201).json(results);
        console.log(results);
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
            reminder: 'USE THESE COL NAMES: title, director, genre, release_year(number), abstract, image'});
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