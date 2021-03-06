import * as mongoose from 'mongoose';
import {Thread} from '../models/thread.model';

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

export interface IUser extends mongoose.Document {
  username: string; 
  email: string;
  password: string;
  countHsz: number;
  character: any;
  admin: boolean;
  thread: any;
  occupied: boolean;
};

export const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
    countHsz: {type: Number, default: 0},
    character: { 
      level: {type: Number, default: 1},
      attack: {type: Number, default: 1},
      defense: {type: Number, default: 1}
    },
    admin: {type: Boolean, default: false},
    thread: {type: mongoose.Schema.Types.ObjectId, default: undefined, ref: 'Thread'},
    occupied: {type: Boolean, default: false}
});

// hash the password before save
UserSchema.pre('save', function preSaveCallback(next) {
  // user
  var _this = this;
  
  // only hash the password if it has been modified (or is new)
  if (!_this.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function genSaltCallback(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(_this.password, salt, function hashCallback(err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      _this.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function compareCallback(err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

UserSchema.pre('remove', function(next) {
  var _this = this;
  Thread.remove({creator: _this._id}).exec();
  next();
});

export const User: mongoose.model<IUser> = mongoose.model<IUser>('User', UserSchema);