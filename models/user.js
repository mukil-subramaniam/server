const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Define the OtherUser model
const OtherUser = sequelize.define('OtherUser', {
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
    tableName: 'other_users',  // Define the table name in MySQL
    timestamps: false  // Prevent Sequelize from adding createdAt and updatedAt fields
});

// Sync the table to MySQL
const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('OtherUser table checked/created');
    } catch (error) {
        console.error('Error initializing OtherUser table:', error.message);
    }
};

// Call the init function
initDatabase();

module.exports = OtherUser;
