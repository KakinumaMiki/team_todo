'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.Team = this.belongsTo(models.Team, {
        foreignKey: 'teamId',
        as: 'team'
      });

      this.Creator = this.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator'
      });

      this.Assignee = this.belongsTo(models.User, {
        foreignKey: 'assigneeId',
        as: 'assignee'
      });

      this.Comment = this.hasMany(models.Comment, {
        foreignKey: 'taskId',
        as: 'comment'
      });
    }

    async finish(user, task, message) {
      task.set({ status: 1 });
      await task.save();
      await task.createComment({
        taskId: task.id,
        creatorId: user.id,
        message: message,
        kind: 1
      });
    }

  }
  Task.init({
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'タイトルは空ではいけません'
        },
        len: {
          msg: 'タイトルは10文字未満です', // 1 ~ 9
          args: [0, 9]
        }
      }
    },
    body: {
      type: DataTypes.STRING,
      validate: {
        len: {
          msg: '本文は30文字未満です', // 0 ~ 29
          args: [0, 29]
        }
      }
    },
    status: {
      type: DataTypes.INTEGER
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assigneeId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};