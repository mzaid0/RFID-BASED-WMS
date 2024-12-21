"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Inputs from "../../../components/Inputs"; // Custom input component
import Authenticate from "@/components/Auth/Authentication";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Role } from "shared/types/role";

// Define the validation schema for signup, adding a role field
// Define the validation schema for signup, adding a role field
const roles = ["Admin", "CounterMan", "Manager", "Worker"] as Role[]

const registerSchemaValidator = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["Admin", "CounterMan", "Manager", "Worker"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});

// Extending SignupFormInputs to include profilePicture
type RegisterSchema = z.infer<typeof registerSchemaValidator> & {
  profilePicture: File | null;
};

const Registration: React.FC = () => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchemaValidator),
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: RegisterSchema) => {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      if (data.profilePicture)
        formData.append("profilePicture", data.profilePicture); // Use profileImage for consistency

      const response = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Employee has been registered successfully.",
      });
      reset();
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Failed to register employee. Please try again.",
      });
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    mutation.mutate({
      ...data,
      profilePicture: profilePicture,
    });
  };

  return (
    <Authenticate>
      <section className="flex items-center justify-center h-screen md:my-10 m-3">
        <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Left side image */}
          <div className="w-1/2 relative hidden lg:block">
            <Image
              src={"/signUp.png"}
              alt="Signup"
              layout="fill"
              objectFit="cover"
              className="h-full w-full"
            />
          </div>

          {/* Right side form */}
          <div className="flex flex-col gap-4 p-10 w-full lg:w-1/2">
            <div>
              <h3 className="text-2xl font-semibold">User Registration</h3>
              <p className="text-sm mt-2 text-gray-600">
                Create an account to get started.
              </p>
            </div>

            {/* Form with input fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Inputs
                type="text"
                placeholder="First Name"
                {...register("firstName")}
                error={errors.firstName?.message}
              />
              <Inputs
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                error={errors.lastName?.message}
              />
              <Inputs
                type="email"
                placeholder="Email"
                {...register("email")}
                error={errors.email?.message}
              />
              <Inputs
                type="password"
                placeholder="Password"
                {...register("password")}
                error={errors.password?.message}
              />

              {/* Role selection dropdown */}
              <div>
                <label className="text-gray-600 text-sm">Select Role</label>
                <select
                  {...register("role")}
                  className="mt-2 block w-full text-sm border border-gray-300 rounded-md p-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Choose your role
                  </option>
                  {
                    roles.map((role) => (
                      <option value={role} key={`${role}-role`}>{role}</option>
                    ))
                  }

                </select>
                {errors.role && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Profile image upload */}
              <div>
                <label className="text-gray-600 text-sm">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-800"
                />
              </div>

              {/* Signup button */}
              <button
                type="submit"
                className="bg-blue-600 w-full mt-4 px-4 py-2 rounded-md text-white font-semibold hover:bg-blue-800 duration-300"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Registering..." : "Register User"}
              </button>

              {mutation.isError && (
                <div className="mt-2 text-red-600">
                  Error: {mutation.error?.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </Authenticate>
  );
};

export default Registration;
