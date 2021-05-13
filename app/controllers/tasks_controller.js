const Controller = require('./controller');
const models = require('../models');
const team = require('../models/team');

class ExamplesController extends Controller {
  // GET /
  async index(req, res) {
    res.render('examples/index', { examples: examples });
  }

  // GET /create
  async create(req, res) {
    const task = models.Task.build({});
    const team = await this._team(req);
    res.render(`tasks/create`, { task, team });
  }
  
  // POST /
  async store(req, res) {
    const team = await this._team(req);
    const task = models.Task.build({
      teamId: team.id,
      title: req.body.title,
      body: req.body.body
    });
    try {
      await task.save();
      await req.flash('info', `タスク[${task.title}]を保存しました`);
      res.redirect(`/teams/${team.id}`);
    } catch (err) {
      throw err;
    }
  }

  // GET /:id
  async show(req, res) {
    const example = examples[req.params.example - 1];
    res.render('examples/show', { example });
  }

  // GET /:id/edit
  async edit(req, res) {
    const task = await this._task(req);
    res.render('tasks/edit', { task });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    examples[req.params.example - 1] = { ...examples[req.params.example - 1], ...req.body };
    await req.flash('info', '更新しました');
    res.redirect(`/examples/${req.params.example}`);
  }

  // DELETE /:id
  async destroy(req, res) {
    await req.flash('info', '削除しました（未実装）');
    res.redirect('/examples/');
  }


  async _team(req) {
    const team = await models.Team.findByPk(req.params.team);
    if (!team) {
      throw new Error('Team not find');
    }
    return team;
  }

  async _task(req) {
    const task = await models.Task.findByPk(req.params.task);
    if (!task) {
      throw new Error('Task not find');
    }
    return task;
  }

}



module.exports = ExamplesController;