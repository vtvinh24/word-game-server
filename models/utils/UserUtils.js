const { isEmail, isPhone } = require("../../common/Validator");
const User = require("../User");

/**
 * This function filters the user object to remove the auth field
 * @param {User} user The User object to filter
 * @returns {object} The filtered user object
 */
function filteredUser(user) {
  if (!(user instanceof User)) {
    throw new Error("Invalid user object");
  }
  const { auth, ...userWithoutAuth } = user.toObject();
  const filtered = Object.fromEntries(Object.entries(userWithoutAuth).filter(([ _, v ]) => v != null));
  return filtered;
}

/**
 * This function returns the full name of the user
 * @param {User} user An instance of User
 * @param {boolean} reverse Value to determine the order of first name and last name
 * @returns {string} The full name of the user
 */
function getFullName(user, reverse = false) {
  if (!(user instanceof User)) {
    throw new Error("Invalid user object");
  }
  const { firstName, lastName } = user;
  if (!firstName && !lastName) {
    return "";
  }
  if (!firstName) {
    return lastName;
  }
  if (!lastName) {
    return firstName;
  }
  return reverse ? `${lastName} ${firstName}` : `${firstName} ${lastName}`;
}

/**
 * This function generates a username for a user based on email or phone
 *
 * If both params are provided, email will be used
 *
 * @async
 * @param {string} email The email of the user
 * @param {string} phone The phone of the user
 *
 * @returns {string} The generated username
 *
 * @throws {Error} If the user object is invalid
 *
 * @example
 * const user = new User({ email: "abc123@mail.com" });
 * const username = await generateUsername(user);
 * console.log(username); // "abc123" if no other user has the similar email/username, otherwise "abc123-1", "abc123-2", etc.
 */
async function generateUsername(email, phone) {
  if (!email && !phone) {
    throw new Error("Email or phone is required");
  }
  if (email && !isEmail(email)) {
    throw new Error("Invalid email");
  }
  if (phone && !isPhone(phone)) {
    throw new Error("Invalid phone");
  }

  let username = "";

  if (email) {
    username = email.split("@")[0];
  } else if (phone) {
    username = phone;
  }

  const matchedUsers = await User.find({ username: new RegExp(`^${username}`, "i") }).countDocuments();

  return username + (matchedUsers ? `-${matchedUsers}` : "");
}

module.exports = {
  filteredUser,
  getFullName,
  generateUsername,
};
