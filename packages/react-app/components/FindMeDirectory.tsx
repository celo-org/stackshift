import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

interface User {
  id: string;
  name: string;
}

function FindMeDirectory() {
  const [users, setUsers] = useState<User[]>([]);


  // useEffect(() => {
  //   // Get the users from SocialConnect.
  //   const users = SocialConnect.getUsers();

  //   // Update the state with the users.
  //   setUsers(users);
  // }, []);

  return (
    <div>
      <div className="bg-gray-100 my-[50px] rounded-lg p-[40px] justify-center place-content-center text-center ">
      <h1 className="font-bold text-2xl text-black my-2">Find Your Friend Directory</h1>
      <p>Find your friend by their twitter handle and send them money easily</p>
      <SearchBar />
    </div>
    </div>
  )
}

export default FindMeDirectory;


