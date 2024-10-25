const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Define the Student model
const Student = sequelize.define('Student', {
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
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rollno: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'students',
    timestamps: false
});

// Sync the table to MySQL
const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('Student table checked/created');
    } catch (error) {
        console.error('Error initializing Student table:', error.message);
    }
};

// Call the init function
initDatabase();

module.exports = Student;
