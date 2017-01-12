const router = require('express').Router();
const db = require('../../config/db');
const abort = require('../../util/abort');

/**
* Insert content data
* POST /api/v1/content
*/
router.post('/', (req, res, next) => {
  const content = {
    diseaseGroup: req.body.diseaseGroup,
    template: req.body.template,
  };

  if (!content.diseaseGroup || !content.template) {
    throw abort(400, 'Missing required parameters "diseaseGroup" or "template"');
  }

  // Check if valid diseaseGroup
  const validateDiseaseGroupID = (diseaseGroup) => {
    if (diseaseGroup === 'all') {
      return Promise.resolve(true);
    } else {
      return db.any(`
        SELECT *
        FROM content
        WHERE disease_group_id = $1`, content.diseaseGroup
      )
      .then((data) => {
        return data.length === 0 ? Promise.resolve(false) : Promise.resolve(true);
      })
      .catch(err => next(err));
    }
  };

  let sqlInsertContent;
  if (content.diseaseGroup !== 'all') {
    sqlInsertContent = `
      INSERT INTO content(disease_group_id, template)
      VALUES($1, $2)
      RETURNING id, disease_group_id AS disease_group, template, created_at, updated_at`;
  } else {
    sqlInsertContent = `
      INSERT INTO content(disease_group_id, template)
      VALUES($1, $2)
      RETURNING id, 'all' AS disease_group, template, created_at, updated_at`;
  }

  validateDiseaseGroupID(content.diseaseGroup)
  .then((valid) => {
    if (!valid) {
      throw abort(400, 'Invalid disease group', `DiseaseGroup ${content.diseaseGroup}`);
    }
    const disease = content.diseaseGroup === 'all' ? null : content.diseaseGroup;
    const template = content.template;

    return db.any(sqlInsertContent, [disease, template]);
  })
  .then((data) => {
    return res.status(200).json({
      status: 'success',
      data,
      message: 'Content data has been inserted',
    });
  })
  .catch(err => next(err));
});

/**
* Retrieve all content data
* GET /api/v1/content
*/
router.get('/', (req, res, next) => {
  const sqlGetContents = `
    SELECT c.id, d.name AS disease_group, c.template
    FROM content AS c
    JOIN disease_group AS d
    ON c.disease_group_id = d.id
    UNION
    SELECT id, 'all' AS disease_group, template
    FROM content
    WHERE disease_group_id IS NULL
    ORDER BY id`;

  db.any(sqlGetContents).then((data) => {
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
  const sqlGetContent = `
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
    WHERE cdg.id = $1`;

  db.any(sqlGetContent, contentID).then((data) => {
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

  const sqlGetContentsDiseaseGroup = `
    SELECT c.id, d.name AS disease_group, c.template
    FROM content AS c
    JOIN disease_group AS d
    ON c.disease_group_id = d.id
    WHERE d.id = $1`;

  const sqlGetContentsAllGroup = `
    SELECT id, $1 AS disease_group, template
    FROM content
    WHERE disease_group_id IS NULL`;

  let sqlGetContents;
  if (diseaseGroupID === 'all') {
    sqlGetContents = sqlGetContentsAllGroup;
  } else {
    sqlGetContents = sqlGetContentsDiseaseGroup;
  }

  db.any(sqlGetContents, diseaseGroupID).then((data) => {
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

/**
* Update content
* PUT /api/v1/content/:id
*/
router.put('/:id', (req, res, next) => {
  const content = {
    contentID: req.params.id,
    diseaseGroup: req.body.diseaseGroup === 'all' ? null : req.body.diseaseGroup,
    template: req.body.template,
  };

  let sqlUpdateContent;
  if (!content.diseaseGroup) {
    sqlUpdateContent = `
      UPDATE content
      SET disease_group_id=$(diseaseGroup), template=$(template)
      WHERE id=$(contentID)
      RETURNING id, 'all' AS disease_group, template, created_at, updated_at`;
  } else {
    sqlUpdateContent = `
      UPDATE content
      SET disease_group_id=$(diseaseGroup), template=$(template)
      WHERE id=$(contentID)
      RETURNING id, disease_group_id AS disease_group, template, created_at, updated_at`;
  }

  db.one(sqlUpdateContent, content)
  .then((data) => {
    res.status(200).json({
      status: 'success',
      data,
      message: 'Content has been updated',
    });
  })
  .catch(err => next(err));
});

/**
* Remove content
* DELETE /api/v1/content/:id
*/
router.delete('/:id', (req, res, next) => {
  const contentID = req.params.id;

  db.result('DELETE FROM content WHERE id=$1', contentID)
  .then((result) => {
    if (result.rowCount === 0) {
      throw abort(404, 'Content not exist or already removed', `${contentID} not found`);
    }
    res.status(200).json({
      status: 'success',
      message: `Content ${contentID} has been removed`,
    });
  })
  .catch(err => next(err));
});

module.exports = router;
