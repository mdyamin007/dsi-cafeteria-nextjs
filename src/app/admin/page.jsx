"use client";
import { database } from "@/firebase/config";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { redirect } from "next/navigation";
import Dashboard from "../components/Dashboard";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [occupantQueue, setOccupantQueue] = useState({});

  //   console.log(occupantQueue);
  const { currentUser } = useAuth()

  if (currentUser) {
    redirect('/home')
  }

  useEffect(() => {
    const adminUsername = localStorage.getItem("adminUsername");
    const adminPassword = localStorage.getItem("adminPassword");
    if (adminUsername === "admin" && adminPassword === "dsi2001") setIsAuthenticated(true);
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
    localStorage.setItem("adminUsername", username);
    localStorage.setItem("adminPassword", password);
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="my-20 md:my-32 flex justify-center items-center">
          <div className="flex justify-center">
            <div className="h-[90%] w-full md:w-3/4 m-4">
              <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0">
                <h1 className="font-semibold text-3xl text-gray-700 m-2">Admin Login</h1>
                {/* <div className="flex">
                  <ion-icon name="logo-google"
                    className="py-2 rounded px-4 border-2 m-1 cursor-pointer border-violet-600 text-white bg-violet-600 hover:bg-white hover:text-violet-600 text-2xl">
                  </ion-icon>
                  <ion-icon name="logo-facebook"
                    className="py-2 rounded px-4 border-2 m-1 cursor-pointer border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500 text-2xl">
                  </ion-icon>
                </div> */}
              </div>
              <div className="flex flex-col justify-center items-center mt-10 md:mt-4 space-y-6 md:space-y-8">
                <div className="">
                  <input type="text" placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className=" bg-gray-100 rounded-lg px-5 py-2 focus:border border-violet-600 focus:outline-none text-black placeholder:text-gray-600 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px]" />
                </div>
                <div className="">
                  <input type="password" placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className=" bg-gray-100 rounded-lg px-5 py-2 focus:border border-violet-600 focus:outline-none text-black placeholder:text-gray-600 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px]" />
                </div>
                <div className="flex space-x-2 -ml-28 md:-ml-40  lg:-ml-52">
                  <input className="" type="checkbox" id="checkbox" name="checkbox" />
                  <h3 className="text-sm font-semibold text-gray-400 -mt-1 cursor-pointer">Remember Me</h3>
                </div>
              </div>
              <div className="text-center mt-7">
                <button
                  onClick={handleLogin}
                  className="uppercase px-24 py-2 rounded-md text-white bg-violet-500 hover:bg-violet-600 font-medium ">login</button>
              </div>

            </div>
          </div>

          <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
          <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>

          {/* <div>
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
          </div> */}
        </div>
      ) : (
        <Dashboard setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
};

export default Admin;
