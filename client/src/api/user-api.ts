import axios from "axios";

export const getAllUsersData = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/v1/user/users");
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to get all parcels");
  }
};