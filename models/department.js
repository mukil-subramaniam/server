const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Initialize the Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Define the Department model
const Department = sequelize.define('Department', {
    deptName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_on: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'departments',
    timestamps: false
});

// Define related models for nested fields
const Parent = sequelize.define('Parent', {
    userId: { type: DataTypes.STRING, allowNull: false },
    deviceId: { type: DataTypes.STRING }
}, {
    tableName: 'parents',
    timestamps: false
});

const Student = sequelize.define('Student', {
    userId: { type: DataTypes.STRING, allowNull: false },
    deviceId: { type: DataTypes.STRING }
}, {
    tableName: 'students',
    timestamps: false
});

const Faculty = sequelize.define('Faculty', {
    userId: { type: DataTypes.STRING, allowNull: false },
    deviceId: { type: DataTypes.STRING }
}, {
    tableName: 'faculty',
    timestamps: false
});

const NonTeaching = sequelize.define('NonTeaching', {
    userId: { type: DataTypes.STRING, allowNull: false },
    deviceId: { type: DataTypes.STRING }
}, {
    tableName: 'nonteaching',
    timestamps: false
});

// Define the associations
Department.hasMany(Parent, { as: 'parents', foreignKey: 'departmentId' });
Department.hasMany(Student, { as: 'students', foreignKey: 'departmentId' });
Department.hasMany(Faculty, { as: 'faculty', foreignKey: 'departmentId' });
Department.hasMany(NonTeaching, { as: 'nonteaching', foreignKey: 'departmentId' });

// Synchronize tables
const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Set to `true` to reset tables on every run
        console.log('Database tables checked/created');
    } catch (error) {
        console.error('Error initializing database:', error.message);
    }
};

// Call this function when the server starts
initDatabase();

module.exports = { Department, Parent, Student, Faculty, NonTeaching };
