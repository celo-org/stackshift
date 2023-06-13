import React from 'react';

export default function CreateProfile() {
  return (
    <div className="bg-gray-100 my-[50px] rounded-lg p-[40px] justify-center place-content-center text-center ">
      <h1 className="font-bold text-2xl text-black my-2">Create Your Profile</h1>
      <p>Connect your wallet & link your twitter account</p>
      <div className="flex flex-col w-full place-content-center justify-center">
      <button className="w-full p-2 bg-prosperity hover:bg-yellow-400  rounded-md text-black mt-6">Connect Wallet Twitter</button>
      <button className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white mt-4">Link Twitter</button>
      </div>
    </div>
  );
};

