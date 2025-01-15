"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();


  useEffect(() => {
    // if (access_token && access_token !== "") {
    //   router.push("/medical-records");
    // } else {
      router.push("/home");
    // }
  }, []);

  return <></>;
}
