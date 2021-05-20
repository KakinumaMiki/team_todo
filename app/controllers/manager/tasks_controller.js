const Controller = require('../controller');
const models = require('../../models');

class ExamplesController extends Controller {
  // GET /create
  async create(req, res) {
    const task = models.Task.build({});
    const team = await this._team(req);
    const memberUsers = await team.getMemberUsers();
    res.render(`manager/tasks/create`, { task, team, memberUsers });
  }

  // POST /
  async store(req, res) {
    const user = await this._user(req);
    const team = await this._team(req);
    let task = "";
    if (user){
      task = models.Task.build({
        teamId: team.id,
        title: req.body.title,
        body: req.body.body,
        creatorId: req.user.id,
        assigneeId: user.id
      });
    } else {
      task = models.Task.build({
        teamId: team.id,
        title: req.body.title,
        body: req.body.body,
        creatorId: req.user.id
      });
    }

    await task.save();
    await req.flash('info', `タスク[${task.title}]を保存しました`);
    res.redirect(`/manager/teams/${team.id}`);
  }

  // GET /:id/edit
  async edit(req, res) {
    const task = await this._task(req);
    const team = await this._team(req);
    const memberUsers = await team.getMemberUsers();
    res.render('manager/tasks/edit', { task, memberUsers });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const user = await this._user(req);
    const team = await this._team(req);
    let task = await this._task(req);
    if (user){
      task.set({
        teamId: team.id,
        title: req.body.title,
        body: req.body.body,
        creatorId: req.user.id,
        assigneeId: user.id
      });
    } else {
      task.set({
        teamId: team.id,
        title: req.body.title,
        body: req.body.body,
        creatorId: req.user.id
      });
    }
    await task.save();
    await req.flash('info', `[${task.title}]を更新しました`);
    res.redirect(`/manager/teams/${task.teamId}`);
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

  async _user(req) {
    if(req.body.displayName) {
      const user = await models.User.findOne({ where : { displayName: req.body.displayName } });
      if (!user) {
        throw new Error('User not find');
      }
      return user;
    } else {
      return null;
    }
  }
}

module.exports = ExamplesController;