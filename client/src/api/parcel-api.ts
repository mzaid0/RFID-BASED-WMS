import axios from "axios";

export const getAllParcelsData = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/v1/parcel/all");
    return response.data.parcels;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to get all parcels");
  }
};

export const updateParcelStatus = async (id: string) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/v1/parcel/status/${id}`
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to update parcel status");
  }
};

export const deleteParcel = async (parcelId: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/v1/parcel/delete/${parcelId}`
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to delete parcel");
  }
};
