"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Emp() {
  const router = useRouter();

useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    
    if (userRole === "employee") {
        router.push("/emp/documents");
    } else {
        router.push("/login");
    }
}, []);

  return <div ></div>;
}
