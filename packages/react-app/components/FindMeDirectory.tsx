import React, { useState, useEffect } from "react";

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
      <h1>Find Me Directory</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FindMeDirectory;


