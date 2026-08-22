import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";


// ==========================================
// REGISTER EMPLOYEE
// ==========================================

export const registerUser = async (
  employeeId,
  email,
  password
) => {
  try {

    // 1. Create Firebase Authentication account
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;


    // 2. Save authentication information
    // inside users collection

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        employeeId: employeeId,
        email: email,
        role: "employee",
        createdAt: serverTimestamp(),
      }
    );


    // 3. Create employee record
    // inside employees collection

    await setDoc(
      doc(db, "employees", employeeId),
      {
        employeeId: employeeId,
        email: email,

        // Default employee information
        name: "",
        department: "",
        designation: "",
        joiningDate: "",

        // Contact information
        phone: "",
        address: "",

        // Salary information
        basicSalary: 0,
        allowances: 0,
        deductions: 0,

        // Profile image
        profileImage: "",

        // Link employee record to Firebase user
        uid: user.uid,

        createdAt: serverTimestamp(),
      }
    );


    return {
      success: true,
      user: user,
    };

  } catch (error) {

    console.error("Registration Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};


// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (
  email,
  password
) => {

  try {

    // Login with Firebase Authentication
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;


    // Get user role from users collection
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
      employeeId: userData.employeeId,
    };


  } catch (error) {

    console.error("Login Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};


// ==========================================
// LOGOUT
// ==========================================

export const logoutUser = async () => {

  try {

    await signOut(auth);

    return {
      success: true,
    };

  } catch (error) {

    console.error("Logout Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};