"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    
    if (userRole === "employee") {
        router.push("/emp");
    } 

    else if (userRole === "admin") {
        router.push("/admin");
    }

    else if (userRole === "user") {
        router.push("/documents");
    }

    else {
        router.push("/login");
    }
}, []);

  return <div ></div>;
}
