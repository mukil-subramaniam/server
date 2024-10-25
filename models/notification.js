const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Define the Notification model
const Notification = sequelize.define('Notification', {
    type: {
        type: DataTypes.JSON, // Stores array as JSON
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.JSON // Stores array as JSON
    },
    dept: {
        type: DataTypes.JSON // Stores array as JSON
    },
    img_link: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.STRING
    },
    expireAt: {
        type: DataTypes.DATE
    },
    created_on: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'notifications',
    timestamps: false
});

// Sync the table to MySQL
const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('Notification table checked/created');
    } catch (error) {
        console.error('Error initializing Notification table:', error.message);
    }
};

// Call the init function
initDatabase();

module.exports = Notification;
