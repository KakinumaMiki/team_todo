const Controller = require('./controller');
const models = require('../models');

class CommentsController extends Controller {
  // POST /
  async store(req, res) {
    const user = await this._user(req);
    const task = await this._task(req);
    const comment = models.Comment.build({
      taskId: task.id,
      creatorId: user.id,
      message: req.body.message
    });
    await comment.save();
    await req.flash('info', `${req.body.message}を送信しました`);
    res.redirect(`/tasks/${task.id}`);
  }


  async _user(req) {
    const user = await models.User.findByPk(req.user.id);
    if (!user) {
      throw new Error('User not find');
    }
    return user;
  }

  async _task(req) {
    const task = await models.Task.findByPk(req.params.task);
    if (!task) {
      throw new Error('Task not find');
    }
    return task;
  }

}

module.exports = CommentsController;