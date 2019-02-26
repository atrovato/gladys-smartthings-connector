
module.exports = {
  webhook: function (req, res, next) {
    console.log('SmartThingsController req', req);
    res.json({ status: 'OK' });
  }
};