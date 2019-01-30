'use strict';

module.exports = (sequalize, DataTypes) => {
    var Transaction = sequalize.define('Transaction', {
        title:DataTypes.STRING,
        amount:DataTypes.FLOAT,
        currency:DataTypes.INTEGER,
        type:DataTypes.INTEGER,
        user_id:DataTypes.INTEGER,
        date:DataTypes.DATE,
        attachment:DataTypes.STRING
    },
    {
        tableName : 'transactions',
        timestamps: true,
    });

    return Transaction;
};