"use client"
import React from 'react';
import Link from 'next/link';

const Cta = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-24 mb-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary opacity-75 sm:text-5xl">
          Your Records, Anytime, <br /> Anywhere
        </h2>

        <p className="mx-auto mt-4 max-w-sm text-gray-500">
          Log in to explore how this system enhances your ability to manage and retrieve customer records effectively.
        </p>
        
        <Link href="/about">
          <button className="btn btn-primary opacity-75 px-12 text-white mt-8">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cta;
