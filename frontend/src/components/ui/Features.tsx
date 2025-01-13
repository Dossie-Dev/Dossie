"use client"
import React from "react";
import Link from "next/link";
import { FiCreditCard, FiMail, FiUser, FiUsers } from "react-icons/fi";

const Features = () => {
  return (
    <div className="px-24 py-16">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-primary opacity-75 sm:text-4xl md:mx-auto">
          What This System Offers
        </h2>
        <p className="text-base text-body-color md:text-lg">
          This system aims to level the playing field so that businesses of any size can have easy, affordable, and secure access to their documents.
        </p>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <Card
          title="Digitized Records"
          subtitle="Easily access your customers' digitized records, converted directly from paper files using advanced technology."
          href="#"
          Icon={FiCreditCard}
        />
        <Card
          title="Secure Access"
          subtitle="A system built with robust security measures to ensure your data's confidentiality and integrity."
          href="#"
          Icon={FiCreditCard}
        />
        <Card
          title="Simplified Search"
          subtitle="Find customer information quickly and effortlessly through our intuitive search functionality."
          href="#"
          Icon={FiCreditCard}
        />
        <Card
          title="Custom Integration"
          subtitle="Designed to fit the unique workflows and requirements of EIC."
          href="#"
          Icon={FiCreditCard}
        />
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, Icon, href }) => {
  return (
    <Link href={href} passHref>
      <div className="w-full h-56 p-8 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#408FFF] to-[#1D4ED8] translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
        <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-[#408FFF] group-hover:text-slate-100 group-hover:rotate-12 transition-transform duration-300" />
        <Icon className="mb-2 text-2xl text-[#408FFF] group-hover:text-white transition-colors relative z-10 duration-300" />
        <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
          {title}
        </h3>
        <p className="text-slate-400 group-hover:text-slate-200 relative z-10 duration-300">
          {subtitle}
        </p>
      </div>
    </Link>
  );
};

export default Features;
