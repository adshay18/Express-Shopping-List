const express = require('express');
const app = express();
const itemRoutes = require('./routes/items.js');
const ExpressError = require('./expressError');

app.use(express.json());
app.use('/items', itemRoutes);

/** 404 handler */

app.use((req, res, next) => {
	const e = new ExpressError('Page Not Found', 404);
	next(e);
});

// General Error Handler
app.use(function(err, req, res, next) {
	let status = err.status || 500;
	let message = err.message;

	return res.status(status).json({
		error: { message, status }
	});
});

module.exports = app;
