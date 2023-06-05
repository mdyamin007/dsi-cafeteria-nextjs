"use client";
import { database } from "@/firebase/config";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [occupantQueue, setOccupantQueue] = useState({});

  //   console.log(occupantQueue);

  useEffect(() => {
    const occupantsRef = ref(database, "occupants");
    onValue(occupantsRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(Object.keys(snapshot.val()).length);
      if (data) {
        // console.log(Object.values(data));
        setOccupantQueue(Object.values(data));
      }
    });
  }, []);

  const handleLogin = (e) => {
    console.log(username);
    console.log(password);
    e.preventDefault();
    if (username === "admin" && password === "dsi2001")
      setIsAuthenticated(true);
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="min-h-screen flex justify-center items-center">
          <div>
            <form>
              <h3>Admin login</h3>
              <div className="flex flex-col">
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  placeholder="username"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                />
                <button onClick={handleLogin}>Login</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <p>Admin</p>
      )}
    </>
  );
};

export default Admin;
