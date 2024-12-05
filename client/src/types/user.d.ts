export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string | null;
    role: "User" | "Admin"; // Assuming role could be "User" or "Admin"
  };
  