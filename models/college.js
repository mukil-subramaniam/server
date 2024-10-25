const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// MySQL connection using Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Define the College model
const College = sequelize.define('College', {
    created_on: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'colleges',
    timestamps: false
});

// Define the Parent model
const Parent = sequelize.define('Parent', {
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    deviceId: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'parents',
    timestamps: false
});

// Define the Student model
const Student = sequelize.define('Student', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deviceId: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'students',
    timestamps: false
});

// Define the Faculty model
const Faculty = sequelize.define('Faculty', {
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    deviceId: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'faculty',
    timestamps: false
});

// Define the NonTeaching model
const NonTeaching = sequelize.define('NonTeaching', {
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    deviceId: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'non_teaching',
    timestamps: false
});

// Define the Administration model
const Administration = sequelize.define('Administration', {
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    deviceId: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'administration',
    timestamps: false
});

// Define the Others model
const Other = sequelize.define('Other', {
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    deviceId: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'others',
    timestamps: false
});

// Define the relationships
College.hasMany(Parent, { foreignKey: 'collegeId', onDelete: 'CASCADE' });
Parent.belongsTo(College, { foreignKey: 'collegeId' });

College.hasMany(Student, { foreignKey: 'collegeId', onDelete: 'CASCADE' });
Student.belongsTo(College, { foreignKey: 'collegeId' });

College.hasMany(Faculty, { foreignKey: 'collegeId', onDelete: 'CASCADE' });
Faculty.belongsTo(College, { foreignKey: 'collegeId' });

College.hasMany(NonTeaching, { foreignKey: 'collegeId', onDelete: 'CASCADE' });
NonTeaching.belongsTo(College, { foreignKey: 'collegeId' });

College.hasMany(Administration, { foreignKey: 'collegeId', onDelete: 'CASCADE' });
Administration.belongsTo(College, { foreignKey: 'collegeId' });

College.hasMany(Other, { foreignKey: 'collegeId', onDelete: 'CASCADE' });
Other.belongsTo(College, { foreignKey: 'collegeId' });

// Function to initialize the tables if they don't exist
const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Sync tables, create if not exist
        console.log('Tables checked/created');
    } catch (error) {
        console.error('Error initializing database:', error.message);
    }
};

// Call this function when the server starts
initDatabase();

module.exports = { College, Parent, Student, Faculty, NonTeaching, Administration, Other };
