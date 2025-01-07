const express = require("express");
const router = express.Router();
const { requireRoles, requireAuth } = require("../../middlewares/JWT");

// Routes
const { getUser } = require("./GetUser");
const { createUser } = require("./CreateUser");
const { deleteUser } = require("./DeleteUser");
const { updateUser } = require("./UpdateUser");
const { ROLE } = require("../../enum/Role");

router.get("/", requireAuth, getUser);
router.patch("/:userId", requireAuth, updateUser);
router.post("/", requireRoles([ROLE.ADMIN ]), createUser);
router.delete("/:userId", requireRoles([ ROLE.ADMIN ]), deleteUser);

// Redirect to medical-records
router.get("/:userId/medical-records", (req, res) => {
  const { userId } = req.params;
  res.redirect(`/medical-records?userId=${userId}`);
});

module.exports = router;
