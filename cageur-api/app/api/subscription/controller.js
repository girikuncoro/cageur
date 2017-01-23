const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  createSubscription(req, res, next) {
    const subscription = {
      clinic_id: req.body.clinic_id,
      bank_id: req.body.bank_id,
      payment_date: req.body.payment_date,
      amount: req.body.amount,
      container: req.body.container,
      transfer_from: req.body.transfer_from,
      transfer_from_account_holder: req.body.transfer_from_account_holder,
      transfer_from_bank_account: req.body.transfer_from_bank_account,
      subscription_start: req.body.subscription_start,
      subscription_end: req.body.subscription_end,
    };

    console.log(req.body.clinic_id)
    console.log('test')

    if (!subscription.clinic_id) {
      throw abort(400, 'Missing required parameters "clinic_id"');
    }

    if (!subscription.bank_id) {
      throw abort(400, 'Missing required parameters "bank_id"');
    }

    db.any(`
      INSERT INTO subscription(clinic_id, bank_id, payment_date, amount, container, transfer_from, transfer_from_account_holder, transfer_from_bank_account, subscription_start, subscription_end)
      VALUES($(clinic_id), $(bank_id), $(payment_date), $(amount), $(container), $(transfer_from), $(transfer_from_account_holder), $(transfer_from_bank_account), $(subscription_start), $(subscription_end))
      RETURNING id, clinic_id, bank_id, payment_date, amount, container,
      transfer_from, transfer_from_account_holder, transfer_from_bank_account, 
      subscription_start, subscription_end,
      created_at, updated_at`, subscription
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'subscription data succesfully added to db',
      });
    })
    .catch(err => next(err));
  },

  getAllSubscription(req, res, next) {
    db.any('SELECT * FROM subscription')
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No subscription data yet', 'Empty subscription table');
      }

      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all subscription data',
      });
    })
    .catch(err => next(err));
  },

  getSingleSubscription(req, res, next) {
    const subscriptionID = req.params.id;

    db.any(`
      SELECT *
      FROM subscription
      WHERE id = ${subscriptionID}
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No bank data found', `subscription ${subscriptionID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved one subscription',
      });
    })
    .catch(err => next(err));
  },

  updateSubscription(req, res, next) {
    const subscription = {
      id: req.params.id,
      clinic_id: req.body.clinic_id,
      bank_id: req.body.bank_id,
      payment_date: req.body.payment_date,
      amount: req.body.amount,
      container: req.body.container,
      transfer_from: req.body.transfer_from,
      transfer_from_account_holder: req.body.transfer_from_account_holder,
      transfer_from_bank_account: req.body.transfer_from_bank_account,
      subscription_start: req.body.subscription_start,
      subscription_end: req.body.subscription_end,
    };

    if (!subscription.clinic_id) {
      throw abort(400, 'Missing required parameters "clinic_id"');
    }

    if (!subscription.bank_id) {
      throw abort(400, 'Missing required parameters "bank_id"');
    }
    db.one(`
      UPDATE subscription
      SET clinic_id=$(clinic_id), bank_id=$(bank_id), payment_date=$(payment_date),
      amount=$(amount), container=$(container), transfer_from=$(transfer_from),
      transfer_from_account_holder=$(transfer_from_account_holder), transfer_from_bank_account=$(transfer_from_bank_account),
      subscription_start=$(subscription_start), subscription_end=$(subscription_end)
      WHERE id = $(id)
      RETURNING id, clinic_id, bank_id, payment_date, amount, 
      container, transfer_from, transfer_from_account_holder, transfer_from_bank_account,
      subscription_start, subscription_end,
      created_at, updated_at`,
      subscription
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data,
        message: 'subscription data has been updated',
      });
    })
    .catch(err => next(err));
  },

  removeSubscription(req, res, next) {
    const subscriptionID = req.params.id;

    db.result(`DELETE FROM subscription WHERE id = ${subscriptionID}`)
    .then((result) => {
      if (result.rowCount === 0) {
        throw abort(404, 'subscription not exist or already removed', `${subscriptionID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        message: 'subscription has been removed',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
