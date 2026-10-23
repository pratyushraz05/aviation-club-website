const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // bcrypt hash only. `select: false` keeps it out of every query by default.
    password: { type: String, required: true, select: false },
    // "admin" or "head" can modify content, "member" has portal access, "user" is normal visitor
    role: {
      type: String,
      enum: ["user", "member", "head", "admin"],
      default: "user",
    },
    branch: { type: String, trim: true, default: "" },
    year: { type: String, trim: true, default: "" },
    subteam: { type: String, trim: true, default: "" },
    membershipRequested: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true } // createdAt, updatedAt
);

userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Safety net: even if a document is ever serialised, the password never leaves.
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
