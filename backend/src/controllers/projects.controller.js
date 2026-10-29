import pool from '../config/db.js';

export async function getProjects(req, res) {
  try {
    const result = await pool.query('SELECT project_id, project_name FROM project ORDER BY project_name ASC;');
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function getProjectBuildings(req, res) {
  const parsedId = Number(req.params.projectId);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ error: 'Invalid request: projectId must be a positive integer.' });
  }

  try {
    const projectCheck = await pool.query('SELECT project_id FROM project WHERE project_id = $1;', [parsedId]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: `Not Found: Project with ID ${parsedId} does not exist.` });
    }

    const result = await pool.query(
      'SELECT building_id, building_number, project_id FROM building WHERE project_id = $1 ORDER BY building_number ASC;',
      [parsedId]
    );
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching project buildings:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function getProjectUnits(req, res) {
  const parsedId = Number(req.params.projectId);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ error: 'Invalid request: projectId must be a positive integer.' });
  }

  try {
    const projectRes = await pool.query('SELECT project_id, project_name FROM project WHERE project_id = $1;', [parsedId]);
    if (projectRes.rows.length === 0) {
      return res.status(404).json({ error: `Not Found: Project with ID ${parsedId} does not exist.` });
    }
    const project = projectRes.rows[0];

    const buildingsRes = await pool.query(
      'SELECT building_id, building_number FROM building WHERE project_id = $1 ORDER BY building_number ASC;',
      [parsedId]
    );
    const buildings = buildingsRes.rows;

    const unitsRes = await pool.query(
      `SELECT u.unit_id, u.unit_number, u.floor, u.area, u.unit_status, u.building_id
       FROM unit u
       JOIN building b ON u.building_id = b.building_id
       WHERE b.project_id = $1
       ORDER BY u.floor ASC, u.unit_number ASC;`,
      [parsedId]
    );
    const units = unitsRes.rows;

    const groupedBuildings = buildings.map((b) => {
      const bUnits = units
        .filter((u) => u.building_id === b.building_id)
        .map(({ building_id, ...rest }) => ({
          ...rest,
          area: Number(rest.area).toFixed(2),
        }));
      return {
        building_id: b.building_id,
        building_number: b.building_number,
        units: bUnits,
      };
    });

    return res.status(200).json({ project, buildings: groupedBuildings });
  } catch (error) {
    console.error('Error fetching project units grouped:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function createProject(req, res) {
  const { project_name } = req.body;
  if (typeof project_name !== 'string' || !project_name.trim()) {
    return res.status(400).json({ error: 'Validation error: project_name must be a non-empty string.' });
  }
  const trimmedName = project_name.trim();
  try {
    const result = await pool.query(
      'INSERT INTO project (project_name) VALUES ($1) RETURNING project_id, project_name;',
      [trimmedName]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Conflict: A project with this name already exists.' });
    }
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function createBuilding(req, res) {
  const { building_number, project_id } = req.body;
  if (typeof building_number !== 'string' || !building_number.trim() || !Number.isInteger(project_id) || project_id <= 0) {
    return res.status(400).json({ error: 'Validation error: invalid building_number or project_id.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO building (building_number, project_id) VALUES ($1, $2) RETURNING building_id, building_number, project_id;',
      [building_number.trim(), project_id]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23503') return res.status(404).json({ error: 'Not Found: Project does not exist.' });
    if (error.code === '23505') return res.status(409).json({ error: 'Conflict: Building already exists in project.' });
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function createUnit(req, res) {
  const { unit_number, floor, area, building_id } = req.body;
  if (!unit_number || !Number.isInteger(floor) || typeof area !== 'number' || area <= 0 || !Number.isInteger(building_id)) {
    return res.status(400).json({ error: 'Validation error: invalid unit details.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO unit (unit_number, floor, area, building_id) VALUES ($1, $2, $3, $4) RETURNING unit_id, unit_number, floor, area, unit_status, building_id;',
      [unit_number.trim(), floor, area, building_id]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23503') return res.status(404).json({ error: 'Not Found: Building does not exist.' });
    if (error.code === '23505') return res.status(409).json({ error: 'Conflict: Unit already exists in building.' });
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
