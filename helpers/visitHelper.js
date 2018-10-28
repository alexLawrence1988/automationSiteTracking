module.exports = function (database) {
    const visit = require('../mongo/visitModel');

    this.captureNewVisit = async function (req, ipInfo) {

        // create the visit model (new visits only)
        var newVisit = new visit({
            clientId: req.body.id,
            startDateTime: req.body.sDate, // take page start date for new visit
            endDateTime: req.body.eDate,
            pages: [{
                pageLocation: req.body.loc || 'Page location unavailable',
                pageTitle: req.body.tit || 'Page title unavailable',
                pointer: req.body.pointer || 'NA',
                startDateTime: req.body.sDate,
                endDateTime: req.body.eDate,
                guid: req.body.guid
            }],
            ipAddress: ipInfo.clientIp,
            device: {
                screen: `${req.body.device.scr.w || 1366}x${req.body.device.scr.h || 780}`,
                browser: req.body.device.brws || 'NA',
                agent: req.body.device.agent || 'NA',
                os: req.body.device.os || 'NA',
                language: req.body.device.lang || 'NA'
            },
            domain: req.body.domain,
            created_at: new Date().getTime(),
            updated_at: new Date().getTime(),
            guid: req.body.guid,
            fingerprint: req.body.fingerprint,
            captureType: 'js'
        });

        newVisit.save(function (err) {
            if (err) {
                console.log(err);
            }

            console.log('record saved');
        })

    }

    this.captureNewPage = async function (req, existingVisit) {

        let newPage = {
            pageLocation: req.body.loc || 'Page location unavailable',
            pageTitle: req.body.tit || 'Page title unavailable',
            pointer: req.body.pointer || 'NA',
            startDateTime: req.body.sDate,
            endDateTime: req.body.eDate,
            guid: req.body.guid
        };

        await visit.findByIdAndUpdate(existingVisit[0]._id,
            { $push: { "pages": newPage } },
            { safe: true, upset: true, new: true }, (err, doc) => {
                if (err) {
                    return false;
                }
                console.log(doc);
                return true;
            });
    }

    this.checkNewGuid = async function (guid) {

        let result = false;

        console.log(`checking db for guid ${guid}`);
        await visit.pages.find({ guid: guid }, (err, visit) => {
            if (err) {
                throw err;
            }
            result = visit.length == 0;
            console.log(`new guid: ${result}`)

        });        

        return result;
    }

    this.checkNewVisit = async function (fingerprint) {
        // TODO: improve the way we check for existing visit in session
        // mongo dates are stored as numbers (javascript dates)
        let result = false;
        let visitStart = new Date().getTime() - 3600000;

        console.log(`checking database for visit in session for fingerpring: ${fingerprint}`);

        await visit.find({ $and: [{ fingerprint: fingerprint }, { startDateTime: { $gt: visitStart } }] }, (err, visit) => {
            if (err) {
                throw err;
            }

            result = visit;
            console.log(`new visit: ${result}`)

        })

        return result;

    }
}