"use client";
import Image from "next/image";
import Link from "next/link";
import heroPic from "../../../assets/sec.png";

const Hero = () => {
  return (
    <section id="about" className="bg-[#FAFCFF]">
      <div className="lg:p-16 rounded-[4rem] space-y-6 md:flex md:gap-6 justify-center md:space-y-0 lg:items-center">
        <div className="mx-8 md:w-7/12 lg:w-1/2">
          <h1 className="text-6xl font-bold text-primary opacity-75">
            Welcome to EIC’s Digital Record Management System
          </h1>
          <p className="my-8 text-gray-600">
            This system is designed exclusively for the Ethiopian Insurance
            Corporation to provide a seamless, secure, and efficient way to
            access and manage customer records. With our tailored solution, EIC
            can streamline operations and deliver superior service to its
            clients.
          </p>
          <Link href="/documentss">
            <button className="btn btn-primary opacity-75 px-12 text-white mr-4">
              Get Started
            </button>
          </Link>
          <Link href="/about">
            <button className="btn btn-outline btn-primary opacity-75 px-12">
              About us
            </button>
          </Link>
        </div>
        <div className="md:w-5/12 lg:w-1/3">
          <Image
            src={heroPic}
            alt="Hero Image"
            loading="lazy"
            className="rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
