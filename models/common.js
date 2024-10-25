const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Set up MySQL connection using Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Define the Common model
const Common = sequelize.define('Common', {
    appVersion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    versionCode: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_on: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'common',
    timestamps: false
});

// Function to initialize the table if it doesn't exist
const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Creates the table if it doesn't already exist
        console.log('Common table checked/created');
    } catch (error) {
        console.error('Error initializing Common table:', error.message);
    }
};

// Call this function when the server starts
initDatabase();

module.exports = Common;
