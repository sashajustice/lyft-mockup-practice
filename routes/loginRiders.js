const express = require('express');
const loginRiderRouter = express.Router();
const {
  selectRidersText,
  selectRiders,
} = require('../selectQueries.js');

loginRiderRouter.get('/riderlogin', (req, res) => {
  let errorObj = {
    error: false,
    message: '',
  };
  if (req.session.email) {
    res.redirect('/');
  }

  if (!req.query.error) {
    res.render('riderlogin', errorObj);
  } else if (req.query.error === 'error1') {
    errorObj.error = true;
    errorObj.message = 'Please identify yourself';
    res.render('riderlogin', errorObj);
  } else if (req.query.error === 'error2') {
    errorObj.error = true;
    errorObj.message = 'Email or password was incorrect. Do it over.';
    res.render('riderlogin', errorObj);
  } else if (req.query.error === 'error3') {
    errorObj.error = true;
    errorObj.message = 'Error, please try again.';
  }
});

loginRiderRouter.post('/riderlogin', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.redirect('riderlogin/?error=error1');
  } else {
    return selectRiders(selectRidersText, [req.body.email], req.body.password)
    .then(result => {
      if (result === true) {
        next();
      } else {
        res.redirect('/riderlogin/?error=error2');
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).redirect('/riderlogin/?error=error3');
    });
  }
});

loginRiderRouter.post('/riderlogin', (req, res) => {
  req.session.email = req.body.email;
  res.redirect('/');
});

module.exports = loginRiderRouter;
