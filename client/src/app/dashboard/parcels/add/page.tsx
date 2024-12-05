"use client";
import Inputs from "@/components/Inputs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Authenticate from "@/components/Auth/Authentication";

// Zod schema for form validation
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

type FormData = z.infer<typeof parcelSchema>;

const AddParcel: FC = () => {
  const router = useRouter();
  const { toast } = useToast();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: async (data) => {
      try {
        parcelSchema.parse(data); // validate data using zod
        return { values: data, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            values: {},
            errors: error.errors.reduce(
              (
                acc: Record<string, { message: string }>,
                e: { path: (string | number)[]; message: string }
              ) => {
                const field = e.path[0]; // First path element, which is the field name
                if (typeof field === "string") {
                  acc[field] = { message: e.message };
                }
                return acc;
              },
              {}
            ),
          };
        }
        return { values: {}, errors: {} };
      }
    },
  });

  // useMutation hook for submitting the parcel data
  const { mutate: createParcel, isPending: loadingSubmit } = useMutation({
    mutationFn: (newParcel: FormData) => {
      return axios.post("http://localhost:4000/api/v1/parcel/add", newParcel);
    },
    onError: (error) => {
      toast({
        title: "Failed to Add",
        description: "An error occurred: " + error.message,
      }); // Show alert instead of console log
    },
    onSuccess: (data) => {
      toast({
        title: "Added Successfully",
        description: data.data.message,
      }); // Show alert instead of console log
      router.push("/dashboard/parcels"); // Redirect to the homepage after successful submission
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = (data) => {
    createParcel(data); // Use the mutate function from useMutation to send the data
    reset(); // Reset the form after submission
  };

  return (
    <Authenticate>
      <section className=" min-h-screen p-5 ">
        <div className=" mx-auto bg-white p-8 rounded-lg shadow-sm ">
          <h1 className="text-2xl mb-6 font-bold text-center">
            Add Parcel Details
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
                  placeholder="Parcel booking date"
                  error={errors.parcelDate?.message}
                />
                <Inputs
                  {...register("parcelWeight")}
                  type="number"
                  placeholder="Parcel Product weight"
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
              <h2 className="text-lg  font-bold">Receiver Details</h2>
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

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={loadingSubmit}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 duration-300"
              >
                {loadingSubmit ? "Submitting..." : "Add Parcel Details"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Authenticate>
  );
};

export default AddParcel;
