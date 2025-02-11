"use client";
import Image from "next/image";
import Link from "next/link";
import heroPic from "../../../assets/sec.png";

const Hero = () => {
  return (
    <section id="about" className="bg-[#FAFCFF]">
      <div className="lg:p-16 rounded-[4rem] space-y-6 md:flex md:gap-6 justify-center md:space-y-0 lg:items-center">
        {/* <div className="mx-8 md:w-7/12 lg:w-1/2">
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
        </div> */}





<div className="w-full lg:w-1/2 space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-primary font-medium">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Digital Innovation
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Welcome to{" "}
              <span className="text-blue-500">
                EIC's Digital Record Management System
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              This system is designed exclusively for the Ethiopian Insurance
              Corporation to provide a seamless, secure, and efficient way to
              access and manage customer records. With our tailored solution, EIC
              can streamline operations and deliver superior service to its
              clients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/documents" className="group">
                <button className="bg-blue-500 text-white px-8 py-3 rounded-lg gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 flex items-center">
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </Link>
              <Link href="/about">
                <button className="border border-primary text-primary px-8 py-3 rounded-lg gap-2 hover:bg-blue-500/10 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  About us
                </button>
              </Link>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Secure Access
              </div>
              <div className="border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                Analytics
              </div>
              <div className="border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                </svg>
                Digital Records
              </div>
            </div>
          </div>

        <div className="md:w-5/12 lg:w-1/3 ">
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
