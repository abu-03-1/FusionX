import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/config";

// Register user
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};