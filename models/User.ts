import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { escape } from 'node:querystring';
import { UserFields, UserModel, UserMethods } from '../types';

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
});

UserSchema.methods.checkPassword = function(password){
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function(){
    this.token = randomUUID();
};

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

UserSchema.set('toJSON', {
    transform: (_doc, ret)=>{
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model<UserFields, UserModel>('User', UserSchema);

export default User;