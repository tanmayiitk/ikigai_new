const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  snapchat: String,
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  tokens: Array,

  profile: 
  {
    firstname: String,
    lastname: String,
    age : Number,
    mobile: Number,
    gender:{type:String,default:"others"},
    location: String,
    qualification: String,
    percentage:String,
    skills : String,
    experience :{type:String,default:"None"},
    website: String,
    picture: String,
    scores: [Number],
  },

  dsat: 
  {
    attempts: { type: Number, default: 0 },
    scores: [Number],
    conductedOn: Array,
    maximum: {type: Number,default:0},
    minimum: {type: Number, default: 0},
    average: { type:  Number,default:0},
  },

  payment:
  {
    orderid: {type: String, default:"not_paid"},
    paymentstatus:{type: String,default:"not_paid"},
    testsleft: {type: Number, default: 0}
  }

}, { timestamps: true });


/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
