const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required() {
      return !this.providerId;
    },
    minlength: 6,
  },
  provider: {
    type: String,
  },
  providerId: {
    type: String,
    default: null,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  profilePicture: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    enum: ['admin', 'cook', 'user'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required() {
      return this.type === 'cook';
    },
  },
  bio: {
    type: String,
    required() {
      return this.type === 'cook';
    },
  },
  dishes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
  },
});

// Used slugify to sanitize username:
userSchema.pre('validate', function (next) {
  try {
    this.username = slugify(
      this.username.trim().replace(/[^a-zA-Z0-9 .]/g, '.'),
      {
        replacement: '.',
        lower: true,
        strict: true,
      }
    );
    next();
  } catch (error) {
    next(error);
  }
});

// Used bcrypt to hash the password before saving it to database.
// When implementing the sign-in function later, we need to use compare method
// to compare the password provided by the user with the hashed password in the database.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
