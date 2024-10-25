const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Define the Faculty model
const Faculty = sequelize.define('Faculty', {
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    dept: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: 'faculty',
    timestamps: false
});

// Sync the table to MySQL
const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // If set to true, it will drop and recreate the table
        console.log('Faculty table checked/created');
    } catch (error) {
        console.error('Error initializing Faculty table:', error.message);
    }
};

// Call the init function
initDatabase();

module.exports = Faculty;
