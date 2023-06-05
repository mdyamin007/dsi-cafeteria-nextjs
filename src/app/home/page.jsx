"use client";

import { redirect } from "next/navigation";
import { useAuth } from "../context/authContext";
import { database } from "@/firebase/config";
import { equalTo, get, onValue, orderByChild, push, query, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";

const Home = () => {
  const [totalOccupations, setTotalOccupations] = useState(0)
  const [isCheckedIn, setIsCheckedin] = useState(false)
  const [checking, setChecking] = useState(false)
  const [checkedInTime, setCheckedInTime] = useState(0)
  const { logout, currentUser, loading } = useAuth();
  const [elapsedTime, setElapsedTime] = useState("")

  useEffect(() => {
    const getNumberOfOccupants = () => {
      const occupantsRef = ref(database, "occupants")
      onValue(occupantsRef, (snapshot) => {
        const data = snapshot.val()
        // console.log(Object.keys(snapshot.val()).length);
        if (data)
          setTotalOccupations(Object.keys(data).length)
        else setTotalOccupations(0)
      })
    }
    const checkCheckedInOrNot = async () => {
      setChecking(true)
      if (currentUser) {
        const userRef = query(ref(database, "occupants"), orderByChild("email"), equalTo(currentUser.email))
        onValue(userRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            setIsCheckedin(true)

          }
          else setIsCheckedin(false)
          // console.log(data);
        })
        setChecking(false)
      }
    }
    checkCheckedInOrNot()
    getNumberOfOccupants();
  }, [])

  if (!currentUser) {
    redirect("/");
  }

  const handleCheckIn = () => {
    if (currentUser) {
      const timestamp = Date.now();
      // console.log(timestamp);
      const occupantsRef = ref(database, "occupants")
      const newOccupantRef = push(occupantsRef)
      let data = {
        name: currentUser.displayName,
        email: currentUser.email,
        photo: currentUser.photoURL,
        timestamp: timestamp,
      }
      set(newOccupantRef, data);
    }
  }

  const handleCheckOut = () => {
    if (currentUser) {
      console.log("Checking out");
      const userRef = query(ref(database, "occupants"), orderByChild("email"), equalTo(currentUser.email))
      remove(userRef)
    }
  }

  return (
    <>
      {checking ? (<p>Loading....</p>) : (<div className="min-h-screen flex flex-col items-center justify-center">
        {
          loading ? (
            <p> Loading...</p >
          ) : (
            <div>
              <p className="my-2">Total occupancy: {totalOccupations}</p>
              <p className="my-2">{elapsedTime} in Cafe!</p>
              {!isCheckedIn ? (<button className="bg-green-400 px-2 py-2 text-white" onClick={handleCheckIn}>Check in</button>) : (<button className="bg-red-400 px-2 py-2 text-white" onClick={handleCheckOut}> Check out?</button>)}
              <button onClick={logout}>Log out</button>
            </div>)}
      </div >)}
    </>
  );
};

export default Home;
