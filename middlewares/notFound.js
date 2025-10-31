function notFound(req, res, next) {
    res.status(404);
    res.json({ error: 'Not found', message: 'Page not found' });
}
module.exports = notFound
