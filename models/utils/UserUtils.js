const { isEmail } = require("#common/Validator.js");
const User = require("#models/User.js");

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
  const filtered = Object.fromEntries(Object.entries(userWithoutAuth).filter(([_, v]) => v != null));
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
 * This function generates a username and tag for a user based on email
 *
 * @async
 * @param {string} email The email of the user
 *
 * @returns {object} An object containing the generated username and tag
 *
 * @throws {Error} If the email is invalid
 *
 * @example
 * const user = new User({ email: "abc123@mail.com" });
 * const { username, tag } = await generateUsername(user.email);
 * console.log(username, tag); // "abc123", "0001" if no other user has the similar email/username
 */
async function generateUsername(email) {
  if (!email || !isEmail(email)) {
    throw new Error("Invalid email");
  }

  let username = email.split("@")[0];

  const matchedUsers = await User.find({ "identifier.username": new RegExp(`^${username}`, "i") }).countDocuments();
  username += matchedUsers ? `-${matchedUsers}` : "";

  const MAX_ATTEMPTS = 10;
  let attempts = 0;
  let tag;
  let isUnique = false;

  while (!isUnique && attempts < MAX_ATTEMPTS) {
    tag = Math.floor(1000 + Math.random() * 9000).toString();
    const existingUser = await User.findOne({ "identifier.username": username, "identifier.tag": tag });
    if (!existingUser) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error("Unable to generate a unique tag");
  }

  return { username, tag };
}

module.exports = {
  filteredUser,
  getFullName,
  generateUsername,
};
