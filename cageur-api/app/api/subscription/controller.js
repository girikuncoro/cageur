const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  createSubscription(req, res, next) {
    const subscription = {
      clinicID: req.body['clinic_id'],
      bankID: req.body['bank_id'],
      paymentDate: req.body['payment_date'],
      amount: req.body['amount'],
      type: req.body['type'],
      transferFrom: req.body['transfer_from'],
      transferFromAccountHolder: req.body['transfer_from_account_holder'],
      transferFromAccountNumber: req.body['transfer_from_account_number'],
      subscriptionStart: req.body['subscription_start'],
      subscriptionEnd: req.body['subscription_end'],
    };

    if (!subscription.clinicID) {
      throw abort(400, 'Missing required parameters "clinic_id"');
    }
    if (!subscription.bankID) {
      throw abort(400, 'Missing required parameters "bank_id"');
    }
    if (!subscription.paymentDate) {
      throw abort(400, 'Missing required parameters "payment_date"');
    }
    if (!subscription.amount) {
      throw abort(400, 'Missing required parameters "amount"');
    }
    if (!subscription.type) {
      throw abort(400, 'Missing required parameters "type"');
    }
    if (!subscription.transferFrom) {
      throw abort(400, 'Missing required parameters "transfer_from"');
    }
    if (!subscription.transferFromAccountHolder) {
      throw abort(400, 'Missing required parameters "transfer_from_account_holder"');
    }
    if (!subscription.transferFromAccountNumber) {
      throw abort(400, 'Missing required parameters "transfer_from_account_number"');
    }
    if (!subscription.subscriptionStart) {
      throw abort(400, 'Missing required parameters "subscription_start"');
    }
    if (!subscription.subscriptionEnd) {
      throw abort(400, 'Missing required parameters "subscription_end"');
    }

    db.any(`
      INSERT INTO subscription(clinic_id, bank_id, payment_date, amount, type, transfer_from, transfer_from_account_holder, transfer_from_account_number, subscription_start, subscription_end)
      VALUES($(clinicID), $(bankID), $(paymentDate), $(amount), $(type), $(transferFrom), $(transferFromAccountHolder), $(transferFromAccountNumber), $(subscriptionStart), $(subscriptionEnd))
      RETURNING id, clinic_id, bank_id, payment_date, amount, type,
      transfer_from, transfer_from_account_holder, transfer_from_account_number,
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
      clinicID: req.body['clinic_id'],
      bankID: req.body['bank_id'],
      paymentDate: req.body['payment_date'],
      amount: req.body['amount'],
      type: req.body['type'],
      transferFrom: req.body['transfer_from'],
      transferFromAccountHolder: req.body['transfer_from_account_holder'],
      transferFromAccountNumber: req.body['transfer_from_account_number'],
      subscriptionStart: req.body['subscription_start'],
      subscriptionEnd: req.body['subscription_end'],
    };

    if (!subscription.clinicID) {
      throw abort(400, 'Missing required parameters "clinic_id"');
    }
    if (!subscription.bankID) {
      throw abort(400, 'Missing required parameters "bank_id"');
    }
    if (!subscription.paymentDate) {
      throw abort(400, 'Missing required parameters "payment_date"');
    }
    if (!subscription.amount) {
      throw abort(400, 'Missing required parameters "amount"');
    }
    if (!subscription.type) {
      throw abort(400, 'Missing required parameters "type"');
    }
    if (!subscription.transferFrom) {
      throw abort(400, 'Missing required parameters "transfer_from"');
    }
    if (!subscription.transferFromAccountHolder) {
      throw abort(400, 'Missing required parameters "transfer_from_account_holder"');
    }
    if (!subscription.transferFromAccountNumber) {
      throw abort(400, 'Missing required parameters "transfer_from_account_number"');
    }
    if (!subscription.subscriptionStart) {
      throw abort(400, 'Missing required parameters "subscription_start"');
    }
    if (!subscription.subscriptionEnd) {
      throw abort(400, 'Missing required parameters "subscription_end"');
    }

    db.one(`
      UPDATE subscription
      SET clinic_id=$(clinicID), bank_id=$(bankID), payment_date=$(paymentDate),
      amount=$(amount), container=$(container), transfer_from=$(transferFrom),
      transfer_from_account_holder=$(transferFromAccountHolder), transfer_from_bank_account=$(transferFromAccountNumber),
      subscription_start=$(subscriptionStart), subscription_end=$(subscriptionEnd)
      WHERE id = $(id)
      RETURNING id, clinic_id, bank_id, payment_date, amount,
      container, transfer_from, transfer_from_account_holder, transfer_from_account_number,
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
