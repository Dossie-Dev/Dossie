"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/users/me", {
        withCredentials: true, // Ensures cookies are sent if required
      });
      setCurrentUser(response.data.data.data[0]);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setCurrentUser(null);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // React to changes in `currentUser`
  useEffect(() => {
    if (!currentUser) {
      router.push('/home');
      return;
    }
    else if (currentUser?.role === "user") {
      router.push('/home');
    } else if (currentUser?.role === "employee") {
      router.push('/emp');
    } else if (currentUser?.role === "admin") {
      router.push('/admin');
    } else {
      router.push('/home');
    }
  }, [currentUser, router]);

  return <></>;
}
