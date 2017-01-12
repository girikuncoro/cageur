const router = require('express').Router();
const db = require('../../config/db');
const abort = require('../../util/abort');

/**
* Insert content data
* POST /api/v1/content
*/
router.post('/', (req, res, next) => {

});

/**
* Retrieve all content data
* POST /api/v1/content
*/
router.get('/', (req, res, next) => {
  const getContents = db.any(`
    SELECT d.name AS disease_group, c.template
    FROM content AS c
    JOIN disease_group AS d
    ON c.disease_group_id = d.id
    UNION
    SELECT 'all' AS disease_group, template
    FROM content
    WHERE disease_group_id IS NULL`);

  getContents.then((data) => {
    const message = data.length === 0 ? 'No content data yet' : 'Retrieved all content data';
    res.status(200).json({
      status: 'success',
      data,
      message,
    });
  })
  .catch(err => next(err));
});

/**
* Retrieve single content data
* POST /api/v1/content/:id
*/
router.get('/:id', (req, res, next) => {

});

module.exports = router;
