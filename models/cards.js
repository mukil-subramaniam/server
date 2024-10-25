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

// Define the Card model
const Card = sequelize.define('Card', {
    created_on: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'cards',
    timestamps: false
});

// Define the TopCard model (for storing top_card array)
const TopCard = sequelize.define('TopCard', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pdf: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'top_cards',
    timestamps: false
});

// Define the QuickLink model (for storing quick_links array)
const QuickLink = sequelize.define('QuickLink', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pdf: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'quick_links',
    timestamps: false
});

// Establish relationships between Card, TopCard, and QuickLink
Card.hasMany(TopCard, { foreignKey: 'cardId', onDelete: 'CASCADE' });
TopCard.belongsTo(Card, { foreignKey: 'cardId' });

Card.hasMany(QuickLink, { foreignKey: 'cardId', onDelete: 'CASCADE' });
QuickLink.belongsTo(Card, { foreignKey: 'cardId' });

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

module.exports = { Card, TopCard, QuickLink };
