'use strict';

module.exports = (sequalize, DataTypes) => {
    var User = sequalize.define('User', {
        name:DataTypes.STRING,
        email:DataTypes.STRING,
        password:DataTypes.STRING
    },
    {
        tableName : 'users',
        timestamps: true,
    });

    return User;
};