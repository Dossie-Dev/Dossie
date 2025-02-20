"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dashboard from "./Dashboard";





export default function Admin() {
  const router = useRouter();

useEffect(() => {
  const userRole = localStorage.getItem("userRole");
  
  if (userRole !== "admin") {
    router.push("/login");
  }
}, []);


  return <Dashboard />;
}
