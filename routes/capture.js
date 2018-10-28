'use strict';

const express = require('express');
const router = express.Router();
const ipware = require('ipware')().get_ip;
const mongo = require('mongoose');
const config = require('../config/config.live.js');
const database = require('../mongo/database');
const visitHelper = require('../helpers/visitHelper.js');
const q = require('q');

// ***SECURITY*** This allows requests from any origin, perhaps should be limited
// to the domain you are expecting to track
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// /capture POST for JS captures
router.post('/capture', (req, res) => {
    let helper = new visitHelper(database);
    // grab ip info
    let ipInfo = ipware(req),
        visit = require('../mongo/visitModel'),
        visitId = 0,
        guid = req.body.guid,
        clientId = req.body.id,
        fingerprint = req.body.fingerprint,
        captureTime = req.body.sDate;

    // check that there hasn't been an error client side which resulted
    // in a single page track being sent multiple times
    helper.checkNewGuid(guid)
        .then((result) => {
            if (!result) {
                throw { success: false, message: "guid already exists" };
            } else {
                // if all good, check to see if this is a new visit or one
                // that's already in session. We have a unique fingerpint 
                // to use as well as a time
                return helper.checkNewVisit(fingerprint, captureTime);
            }
        })
        .then((visit) => {
            if (visit.length > 0) {
                // otherwise lets capture the ne page
                console.log('Adding page to visit.');
                return helper.captureNewPage(req, visit, ipInfo);
            }

            // if it's not a new visit then lets create one
            console.log('Capturing visit info.');
            return helper.captureNewVisit(req, ipInfo);
        })
        .then((action) => {

            // we probably want to do some more stuff here but for
            // now lets just log it out
            res.json({ success: true, message: action });
        })
        .catch((err) => {
            // we will set up an elastisearch for the client to log out
            // but for now just return the error to be handled client side
            res.json(err);
        })

});

// /capture GET for browsers with javascript disabled
router.get('/capture', (req, res) => {
    // grab ip info
    let ipInfo = ipware(req);
})

module.exports = router;

