import { z } from "zod";

// validation that expects a variable as a string and check its minimum length (minimum 1)
const requiredString = z.string().trim().min(1, "Required");

// sign up schema
export const signUpSchema = z.object({
  // email validation
  email: requiredString.email("Invalid email address"),

  // user name validation (-, _ and letters allowed)
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  // password validation (min length: 8 default)
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

// login schema
export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValue = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
