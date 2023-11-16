const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    ProfilePic: {
      type: String
    },

    firstname: {
      type: String,
      required: [true, "Please enter your first name"],
    },

    lastname: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
    },
    mobile: {
      type: String,
      required: [true, "Please enter your mobile number"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt pasword using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

module.exports = mongoose.model("User", userSchema);