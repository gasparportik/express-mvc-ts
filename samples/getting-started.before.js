app.get('/', function (req, res) {
    refererService.saveReferer(req.query.referer);
    res.render('home');
});

app.get('/about', function (req, res) {
    if (req.get('Content-Type') === 'application/json') {
        res.json({ description: "This is my site." });
    } else {
        res.render('about');
    }
});

app.get('/contact/form(/:reason)?', function (req, res) {
    res.render('contact/index', { reason: req.params.reason });
});

app.post('/contact/api/save', function (req, res) {
    var contactRequest = req.body;
    myDataStore.saveContactRequest(contactRequest)
        .then(() => res.json({ success: true }))
        .catch(() => res.json({ success: false }));
});