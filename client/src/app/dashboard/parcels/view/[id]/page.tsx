"use client";
import Authenticate from "@/components/Auth/Authentication";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  FaBox,
  FaCalendar,
  FaCogs,
  FaTag,
  FaTruck,
  FaWeightHanging,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPerson, MdPhone } from "react-icons/md";

// Fetch Parcel Data using Axios
const fetchParcel = async (id: string) => {
  const response = await axios.get(
    `http://localhost:4000/api/v1/parcel/view/${id}`
  );
  return response.data.parcel;
};

const ViewParcel = () => {
  const { id }: { id: string } = useParams();

  const {
    data: parcel,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["parcel", id],
    queryFn: () => fetchParcel(id),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Authenticate>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center text-black mb-8">
          Parcel Details
        </h2>

        {/* Parcel Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-black mb-4">
            Parcel Information
          </h3>
          {/* Use grid to split the details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <ul className="space-y-4">
              <li className="flex items-center text-black">
                <p className="text-xs">
                  <span className="font-semibold ">Parcel ID:</span> {parcel.id}
                </p>
              </li>
              <li className="flex items-center text-black">
                <FaBox className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {parcel.parcelName}
                </p>
              </li>
              <li className="flex items-center text-black">
                <FaTag className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Price:</span> ${" "}
                  {parcel.parcelPrice}
                </p>
              </li>
              <li className="flex items-center text-black">
                <FaWeightHanging className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Weight:</span>{" "}
                  {parcel.parcelWeight} kg
                </p>
              </li>
            </ul>

            {/* Right column */}
            <ul className="space-y-2">
              <li className="flex items-center text-black">
                <FaCalendar className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(parcel.parcelDate).toLocaleDateString()}
                </p>
              </li>
              <li className="flex items-center text-black">
                <FaCogs className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Status:</span> {parcel.status}
                </p>
              </li>
              <li className="flex items-center text-black">
                <FaTruck className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Tracking Number:</span>{" "}
                  {parcel.parcelTrackingNumber}
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender Info Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-black mb-4">
              Sender Information
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-black">
                <MdPerson className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {parcel.senderFirstName} {parcel.senderLastName}
                </p>
              </li>
              <li className="flex items-center text-black">
                <MdPhone className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {parcel.senderPhoneNumber}
                </p>
              </li>
              <li className="flex items-center text-black">
                <MdEmail className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {parcel.senderEmail}
                </p>
              </li>
              <li className="flex items-center text-black">
                <MdLocationOn className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {parcel.senderAddress}
                </p>
              </li>
            </ul>
          </div>

          {/* Receiver Info Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-black mb-4">
              Receiver Information
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-black">
                <MdPerson className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {parcel.receiverFirstName} {parcel.receiverLastName}
                </p>
              </li>
              <li className="flex items-center text-black">
                <MdPhone className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {parcel.receiverPhoneNumber}
                </p>
              </li>
              <li className="flex items-center text-black">
                <MdEmail className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {parcel.receiverEmail}
                </p>
              </li>
              <li className="flex items-center text-black">
                <MdLocationOn className="mr-3 text-blue-600" />
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {parcel.receiverAddress}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Authenticate>
  );
};

export default ViewParcel;
