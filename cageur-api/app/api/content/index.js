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
* GET /api/v1/content
*/
router.get('/', (req, res, next) => {
  const getContents = db.any(`
    SELECT c.id, d.name AS disease_group, c.template
    FROM content AS c
    JOIN disease_group AS d
    ON c.disease_group_id = d.id
    UNION
    SELECT id, 'all' AS disease_group, template
    FROM content
    WHERE disease_group_id IS NULL
    ORDER BY id`);

  getContents.then((data) => {
    const message = data.length === 0 ? 'No content data yet' : 'Retrieved all content data';
    return res.status(200).json({
      status: 'success',
      data,
      message,
    });
  })
  .catch(err => next(err));
});

/**
* Retrieve single content data
* GET /api/v1/content/:id
*/
router.get('/:id', (req, res, next) => {
  const contentID = req.params.id;
  const getContent = db.any(`
    SELECT *
    FROM (
    	SELECT c.id, d.name AS disease_group, c.template
    	FROM content AS c
    	JOIN disease_group AS d
    	ON c.disease_group_id = d.id
    	UNION
    	SELECT id, 'all' AS disease_group, template
    	FROM content
    	WHERE disease_group_id IS NULL
    	ORDER BY id) AS cdg
    WHERE cdg.id = $1`, contentID);

  getContent.then((data) => {
    if (data.length === 0) {
      throw abort(404, 'No content data found', `Content ${contentID} not found`);
    }
    return res.status(200).json({
      status: 'success',
      data,
      message: 'Retrieved one content'
    });
  })
  .catch(err => next(err));
});

/**
* Retrieve contents given disease group
* GET /api/v1/content/disease_group/all
* GET /api/v1/content/disease_group/:id
*/
router.get('/disease_group/:id', (req, res, next) => {
  const diseaseGroupID = req.params.id;

  const getContentsDiseaseGroup = db.any(`
    SELECT c.id, d.name AS disease_group, c.template
    FROM content AS c
    JOIN disease_group AS d
    ON c.disease_group_id = d.id
    WHERE d.id = $1`, diseaseGroupID);

  const getContentsAllGroup = db.any(`
    SELECT id, 'all' AS disease_group, template
    FROM content
    WHERE disease_group_id IS NULL`);

  let getContents;
  if (diseaseGroupID === 'all') {
    getContents = getContentsAllGroup;
  } else {
    getContents = getContentsDiseaseGroup;
  }

  getContents.then((data) => {
    if (data.length === 0) {
      throw abort(404, 'No content data found', `DiseaseGroup ${diseaseGroupID} not found`);
    }
    return res.status(200).json({
      status: 'success',
      data,
      message: 'Retrieved content data for disease group'
    });
  })
  .catch(err => next(err));
});

module.exports = router;
