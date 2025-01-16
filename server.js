require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration
const sequelize = new Sequelize({
  host: 'localhost',
  username: 'root',
  password: 'Saran@2004',
  database: 'task_management',
  dialect: 'mysql',
  logging: true
});

// Add this for debugging
console.log('Database Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  // Don't log the password
});

// Define User Model
const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false,
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    }
  }
});

// Define Task Model
const Task = sequelize.define('tasks', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false,
  tableName: 'tasks'
});

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) throw new Error();

    const userData = user.toJSON();
    delete userData.password;
    
    req.user = userData;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    const userData = user.toJSON();
    delete userData.password;
    
    res.status(201).json({ user: userData, token });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    const userData = user.toJSON();
    delete userData.password;
    
    res.json({ user: userData, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Task Routes
app.post('/api/tasks', auth, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user_id: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'status'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const [updatedRows] = await Task.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    const deletedRows = await Task.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize Database and Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Use existing tables instead of creating new ones
    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 