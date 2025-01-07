const getRoot = async (req, res) => {
  return res.status(200).send("Hello World");
};

module.exports = getRoot;
