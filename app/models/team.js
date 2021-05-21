'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.Owner = this.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'owner'
      });

      this.Tasks = this.hasMany(models.Task, {
        foreignKey: 'teamId',
        as: 'tasks'
      });

      this.Member = this.hasMany(models.Member, {
        foreignKey: 'teamId',
        as: 'member'
      });
    }
  }
  Team.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};