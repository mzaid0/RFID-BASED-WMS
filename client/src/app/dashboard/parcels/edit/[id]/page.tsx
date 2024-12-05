"use client";
import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import Inputs from "@/components/Inputs";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Authenticate from "@/components/Auth/Authentication";

// Zod schema for form validation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const parcelSchema = z.object({
  parcelName: z.string().min(1, "Parcel Name is required"),
  parcelPrice: z.string().min(1, "Parcel Price is required"),
  parcelDate: z.string().min(1, "Parcel Date is required"),
  parcelTrackingNumber: z.string().min(1, "Parcel Tracking Number is required"),
  parcelWeight: z.string().min(1, "Parcel Weight is required"),
  senderFirstName: z.string().min(1, "Sender First Name is required"),
  senderLastName: z.string().min(1, "Sender Last Name is required"),
  senderEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Sender Email is required"),
  senderPhoneNumber: z.string().min(1, "Sender Phone Number is required"),
  senderAddress: z.string().min(1, "Sender Address is required"),
  receiverFirstName: z.string().min(1, "Receiver First Name is required"),
  receiverLastName: z.string().min(1, "Receiver Last Name is required"),
  receiverEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Receiver Email is required"),
  receiverPhoneNumber: z.string().min(1, "Receiver Phone Number is required"),
  receiverAddress: z.string().min(1, "Receiver Address is required"),
});

// Define the FormData type
type FormData = z.infer<typeof parcelSchema>;

const UpdateParcel: FC = () => {
  const router = useRouter();
  const { toast } = useToast();

  const { id }: { id: string } = useParams();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  // Fetch parcel data with TanStack Query
  const fetchParcel = async (parcelId: string) => {
    const response = await axios.get(
      `http://localhost:4000/api/v1/parcel/view/${parcelId}`
    );
    return response.data.parcel; // Return the parcel data from API
  };

  const {
    data: parcel,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parcel", id],
    queryFn: () => fetchParcel(id),
    enabled: !!id, // Ensure the query only runs if id is available
  });

  // Populate form with fetched data
  useEffect(() => {
    if (parcel) {
      reset(parcel);
    }
  }, [parcel, reset]);

  // useMutation hook for updating the parcel data
  const { mutate: updateParcel, isPending: loadingSubmit } = useMutation({
    mutationFn: (updatedParcel: FormData) => {
      return axios.put(
        `http://localhost:4000/api/v1/parcel/edit/${id}`,
        updatedParcel
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error Updating Parcel",
        description: "An error occurred: " + error.message,
      }); // Show alert instead of console log
    },
    onSuccess: (data) => {
      toast({
        title: "Parcel Updated",
        description: data.data.message,
      }); // Show alert instead of console log
      router.push("/dashboard/parcels"); // Redirect to the parcels list after successful submission
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = (data) => {
    updateParcel(data); // Use the mutate function from useMutation to send the data
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading parcel data.</p>;

  return (
    <Authenticate>
      <section className=" min-h-screen p-5">
        <div className=" mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl mb-6  font-bold text-center">
            Update Parcel Details
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parcel Info */}
              <div className="space-y-4">
                <Inputs
                  {...register("parcelName")}
                  type="text"
                  placeholder="Parcel Product Name"
                  error={errors.parcelName?.message}
                />
                <Inputs
                  {...register("parcelDate")}
                  type="date"
                  placeholder="Parcel Booking Date"
                  error={errors.parcelDate?.message}
                />
                <Inputs
                  {...register("parcelWeight")}
                  type="number"
                  placeholder="Parcel Product Weight"
                  error={errors.parcelWeight?.message}
                />
              </div>
              <div className="space-y-4">
                <Inputs
                  {...register("parcelPrice")}
                  type="text"
                  placeholder="Parcel Product Price"
                  error={errors.parcelPrice?.message}
                />
                <Inputs
                  {...register("parcelTrackingNumber")}
                  type="text"
                  placeholder="Parcel Tracking Number"
                  error={errors.parcelTrackingNumber?.message}
                />
              </div>
            </div>

            {/* Sender Info */}
            <div className="space-y-6 mt-8">
              <h2 className="text-lg font-bold">Sender Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Inputs
                  {...register("senderFirstName")}
                  type="text"
                  placeholder="First Name"
                  error={errors.senderFirstName?.message}
                />
                <Inputs
                  {...register("senderLastName")}
                  type="text"
                  placeholder="Last Name"
                  error={errors.senderLastName?.message}
                />
                <Inputs
                  {...register("senderEmail")}
                  type="email"
                  placeholder="Email"
                  error={errors.senderEmail?.message}
                />
                <Inputs
                  {...register("senderPhoneNumber")}
                  type="text"
                  placeholder="Phone Number"
                  error={errors.senderPhoneNumber?.message}
                />
                <Inputs
                  {...register("senderAddress")}
                  type="text"
                  placeholder="Address"
                  error={errors.senderAddress?.message}
                />
              </div>
            </div>

            {/* Receiver Info */}
            <div className="space-y-6 mt-8">
              <h2 className="text-lg font-bold">Receiver Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Inputs
                  {...register("receiverFirstName")}
                  type="text"
                  placeholder="First Name"
                  error={errors.receiverFirstName?.message}
                />
                <Inputs
                  {...register("receiverLastName")}
                  type="text"
                  placeholder="Last Name"
                  error={errors.receiverLastName?.message}
                />
                <Inputs
                  {...register("receiverEmail")}
                  type="email"
                  placeholder="Email"
                  error={errors.receiverEmail?.message}
                />
                <Inputs
                  {...register("receiverPhoneNumber")}
                  type="text"
                  placeholder="Phone Number"
                  error={errors.receiverPhoneNumber?.message}
                />
                <Inputs
                  {...register("receiverAddress")}
                  type="text"
                  placeholder="Address"
                  error={errors.receiverAddress?.message}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                {loadingSubmit ? "Updating..." : "Update Parcel Details"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Authenticate>
  );
};

export default UpdateParcel;
