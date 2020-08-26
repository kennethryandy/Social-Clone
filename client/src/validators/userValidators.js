import * as yup from "yup";

export const signupSchema = yup.object().shape({
  username: yup.string().min(3).max(30).trim().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).max(30).trim().required(),
  confirmPassword: yup.string().min(6).trim().max(30).required(),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).max(30).trim().required(),
});
