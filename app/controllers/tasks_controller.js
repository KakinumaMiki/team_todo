const Controller = require('./controller');
const models = require('../models');

class ExamplesController extends Controller {
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
    await task.save();
    await req.flash('info', `タスク[${task.title}]を保存しました`);
    res.redirect(`/teams/${team.id}`);
  }

  // GET /:id/edit
  async edit(req, res) {
    const task = await this._task(req);
    res.render('tasks/edit', { task });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const task = await this._task(req);
    task.set(req.body);
    await task.save();
    await req.flash('info', `[${task.title}]を更新しました`);

    res.redirect(`/teams/${task.teamId}`);
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