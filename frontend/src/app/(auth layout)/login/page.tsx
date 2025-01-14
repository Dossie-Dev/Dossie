import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function Login() {



  return (

    <div className='p-3 py-24 max-w-lg mx-auto'>
      <h1 className='text-center font-semibold my-7 mb-8'>
        <span className='text-md'>ሰላም 👋 , Welcome Back!</span> <br />
        <span className='text-4xl font-bold text-primary opacity-75'>Login to Dossie</span>
      </h1>
      <form className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
        />
        <button
          className='bg-primary opacity-75 text-white p-3 rounded-lg uppercase hover:opacity-95'
        >
          Login
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link href='/register'>
          <span className='text-blue-700'>Register</span>
        </Link>
      </div>
    </div>
  );
}