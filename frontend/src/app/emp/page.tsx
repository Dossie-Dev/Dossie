"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Emp() {
  const router = useRouter();

useEffect(() => {

    router.push("/emp/documents");
  
}, []);

  return <div ></div>;
}
