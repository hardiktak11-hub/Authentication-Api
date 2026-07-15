import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

//userchema is the template that every new data entry require if return require:true then it must be present while submitting else the entry will not be submitted.
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// an mangoose middleware which runs everytime we are creatind or saving an entry in the database and it is used to hash the password 
userSchema.pre("save", async function () {

    if (!this.isModified("password")){
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});

//used to compare password which helps in login feature
userSchema.methods.comparePassword= async function(password) {
    return await bcrypt.compare(password,this.password)
}

//AccesToken
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

//RefreshToken
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};


const User = mongoose.model("User", userSchema);
export default User;