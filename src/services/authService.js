import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

// Register Employee
export const registerUser = async (
  employeeId,
  email,
  password
) => {
  try {
    // Create Firebase Authentication account
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    // Save employee information in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      employeeId: employeeId,
      email: email,
      role: "employee",
      createdAt: new Date(),
    });

    return {
      success: true,
      user: user,
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};


// Login User
export const loginUser = async (
  email,
  password
) => {
  try {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    // Get user role from Firestore
    const userDoc = await getDoc(
      doc(db, "users", user.uid)
    );

    if (!userDoc.exists()) {
      await signOut(auth);

      return {
        success: false,
        error: "User profile not found.",
      };
    }

    const userData = userDoc.data();

    return {
      success: true,
      user: user,
      role: userData.role,
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};


// Logout User
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