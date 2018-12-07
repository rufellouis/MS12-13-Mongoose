exports.get404 = (req, res, next) => {
  res.status(404).render('404', {pageTitle: 'MS12-13-Mongoose Error', path: ''});
};
