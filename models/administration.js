// Sequelize and MySQL Setup
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// MySQL connection using Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Define the Admin model (table)
const Admin = sequelize.define('Administration', {
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    photoUrl: {
        type: DataTypes.STRING
    },
    deviceId: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    created_on: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'administration', // Optional: define table name
    timestamps: false // Disable default timestamps (createdAt, updatedAt)
});

// Function to initialize the table if it doesn't exist
const initAdminTable = async () => {
    try {
        await sequelize.sync({ force: false }); // Sync the model with the table, create if not exists
        console.log('Admin table checked/created');
    } catch (error) {
        console.error('Error creating Admin table:', error.message);
    }
};

// Call this function when the server starts
initAdminTable();

module.exports = Admin;
