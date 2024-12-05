import User from "../models/userModel.js";

const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    const { password, ...userData } = user.toObject();

    return res.status(200).json(userData);
  } catch (err) {
    return res.status(400).json({ msg: "user not found" });
  }
};

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  const currentDetails = await User.findOne({ email });

  if (!currentDetails) {
    return res.status(400).json({ msg: "Error" });
  }

  if (currentDetails.name != name) {
    currentDetails.name = name;
  }

  if (currentDetails.password != password) {
    currentDetails.password = password;
  }

  await currentDetails.save();

  return res.status(200).json({ msg: "details updated" });
};

const deleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    return res.status(200).json({ msg: "user deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "An error occurred while deleting the user" });
  }
};

export { getById, updateUser, deleteUser };
