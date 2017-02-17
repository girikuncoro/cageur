const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  createTemplate(req, res, next) {
    const template = {
      diseaseGroup: req.body['disease_group'],
      title: req.body.title,
      content: req.body.content,
    };

    if (!template.diseaseGroup || !template.title || !template.content) {
      throw abort(400, 'Missing required parameters "disease_group" or "title" or "content"');
    }

    // Check if valid diseaseGroup
    const validateDiseaseGroupID = (diseaseGroup) => {
      if (diseaseGroup === 'all') {
        return Promise.resolve(true);
      }
      return db.any(`
        SELECT *
        FROM template
        WHERE disease_group_id = $1`, template.diseaseGroup
      )
      .then((data) => {
        if (data.length === 0) {
          return Promise.resolve(false);
        }
        return Promise.resolve(true);
      })
      .catch(err => next(err));
    };

    let sqlInsertTemplate;
    if (template.diseaseGroup !== 'all') {
      sqlInsertTemplate = `
        INSERT INTO template(disease_group_id, title, content)
        VALUES($1, $2, $3)
        RETURNING id, disease_group_id AS disease_group, title, content, created_at, updated_at`;
    } else {
      sqlInsertTemplate = `
        INSERT INTO template(disease_group_id, title, content)
        VALUES($1, $2, $3)
        RETURNING id, 'all' AS disease_group, title, content, created_at, updated_at`;
    }

    validateDiseaseGroupID(template.diseaseGroup)
    .then((valid) => {
      if (!valid) {
        throw abort(400, 'Invalid disease group', `DiseaseGroup ${template.diseaseGroup}`);
      }
      const disease = template.diseaseGroup === 'all' ? null : template.diseaseGroup;
      const title = template.title;
      const content = template.content;

      return db.any(sqlInsertTemplate, [disease, title, content]);
    })
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Template data has been inserted',
      });
    })
    .catch(err => next(err));
  },

  getAllTemplate(req, res, next) {
    const sqlGetTemplates = `
      SELECT t.id, d.name AS disease_group, t.title, t.content
      FROM template AS t
      JOIN disease_group AS d
      ON t.disease_group_id = d.id
      UNION
      SELECT id, 'all' AS disease_group, title, content
      FROM template
      WHERE disease_group_id IS NULL
      ORDER BY id`;

    db.any(sqlGetTemplates).then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No template data yet', 'Empty template table');
      }
      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all template data',
      });
    })
    .catch(err => next(err));
  },

  getSingleTemplate(req, res, next) {
    const templateID = req.params.id;
    const sqlGetTemplate = `
    SELECT *
    FROM (SELECT t.id, d.name AS disease_group, t.title, t.content
      FROM template AS t
      JOIN disease_group AS d
      ON t.disease_group_id = d.id
      UNION
      SELECT id, 'all' AS disease_group, title, content
      FROM template
      WHERE disease_group_id IS NULL
      ORDER BY id) AS cdg
    WHERE cdg.id = $1`;

    db.any(sqlGetTemplate, templateID).then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No template data found', `Template ${templateID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved one template',
      });
    })
    .catch(err => next(err));
  },

  getTemplateByDiseaseGroup(req, res, next) {
    const diseaseGroupID = req.params.id;

    const sqlGetTemplatesDiseaseGroup = `
      SELECT t.id, d.name AS disease_group, t.title, t.content
      FROM template AS t
      JOIN disease_group AS d
      ON t.disease_group_id = d.id
      WHERE d.id = $1`;

    const sqlGetTemplatesAllGroup = `
      SELECT id, $1 AS disease_group, title, content
      FROM template
      WHERE disease_group_id IS NULL`;

    let sqlGetTemplates;
    if (diseaseGroupID === 'all') {
      sqlGetTemplates = sqlGetTemplatesAllGroup;
    } else {
      sqlGetTemplates = sqlGetTemplatesDiseaseGroup;
    }

    db.any(sqlGetTemplates, diseaseGroupID).then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No template data found', `DiseaseGroup ${diseaseGroupID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved template data for disease group',
      });
    })
    .catch(err => next(err));
  },

  updateTemplate(req, res, next) {
    const template = {
      templateID: req.params.id,
      diseaseGroup: req.body.diseaseGroup === 'all' ? null : req.body.diseaseGroup,
      title: req.body.title,
      content: req.body.content,
    };

    if (!req.body.diseaseGroup || !template.title || !template.content) {
      throw abort(400, 'Missing required parameters "diseaseGroup" or "title" or "content"');
    }

    let sqlUpdateTemplate;
    if (!template.diseaseGroup) {
      sqlUpdateTemplate = `
        UPDATE template
        SET disease_group_id=$(diseaseGroup), title=$(title), content=$(content)
        WHERE id=$(templateID)
        RETURNING id, 'all' AS disease_group, title, content, created_at, updated_at`;
    } else {
      sqlUpdateTemplate = `
        UPDATE template
        SET disease_group_id=$(diseaseGroup), title=$(title), content=$(content)
        WHERE id=$(templateID)
        RETURNING id, disease_group_id AS disease_group, title, content, created_at, updated_at`;
    }

    db.one(sqlUpdateTemplate, template)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data,
        message: 'Template has been updated',
      });
    })
    .catch(err => next(err));
  },

  removeTemplate(req, res, next) {
    const templateID = req.params.id;

    db.result('DELETE FROM template WHERE id=$1', templateID)
    .then((result) => {
      if (result.rowCount === 0) {
        throw abort(404, 'Template not exist or already removed', `${templateID} not found`);
      }
      res.status(200).json({
        status: 'success',
        message: 'Template has been removed',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
