"use client";

import { redirect } from "next/navigation";
import { useAuth } from "../context/authContext";
import { database } from "@/firebase/config";
import {
  equalTo,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";

const Home = () => {
  const [totalOccupations, setTotalOccupations] = useState(0);
  const [isCheckedIn, setIsCheckedin] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkedInTime, setCheckedInTime] = useState("");
  const [elapsedTime, setElapsedTime] = useState("");
  const { logout, currentUser, loading } = useAuth();

  // console.log(moment().format());

  useEffect(() => {
    const getNumberOfOccupants = () => {
      const occupantsRef = ref(database, "occupants");
      onValue(occupantsRef, (snapshot) => {
        const data = snapshot.val();
        // console.log(Object.keys(snapshot.val()).length);
        if (data) setTotalOccupations(Object.keys(data).length);
        else setTotalOccupations(0);
      });
    };
    const checkCheckedInOrNot = async () => {
      setChecking(true);
      if (currentUser) {
        const userRef = query(
          ref(database, "occupants"),
          orderByChild("email"),
          equalTo(currentUser.email)
        );
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setIsCheckedin(true);
            // console.log(Object.values(data)[0]);
            setCheckedInTime(Object.values(data)[0].timestamp);
          } else setIsCheckedin(false);
          // console.log(data);
        });
        setChecking(false);
      }
    };
    checkCheckedInOrNot();
    getNumberOfOccupants();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeDiff = moment(checkedInTime).fromNow(true);

      setElapsedTime(timeDiff);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [checkedInTime]);

  if (!currentUser) {
    redirect("/");
  }

  const handleCheckIn = () => {
    if (currentUser) {
      const timestamp = moment().format();
      // console.log(timestamp);
      const occupantsRef = ref(database, "occupants");
      const newOccupantRef = push(occupantsRef);
      let data = {
        uid: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        timestamp: timestamp,
      };
      set(newOccupantRef, data);
    }
  };

  const handleCheckOut = () => {
    if (currentUser) {
      console.log("Checking out");
      const userRef = query(
        ref(database, "occupants"),
        orderByChild("uid"),
        equalTo(currentUser.uid)
      );
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          remove(ref(database, "occupants/" + Object.keys(snapshot.val())[0]))
        }
      }, { onlyOnce: true });
      setCheckedInTime("");
      setIsCheckedin(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {checking ? (
        <p>Loading....</p>
      ) : (
        <div className="p-10">
          {loading ? (
            <p> Loading...</p>
          ) : (
            <div className="flex justify-center flex-col items-center">
              <p className="mt-10 mb-14 text-6xl">{totalOccupations}</p>

              {!isCheckedIn ? (
                <button
                  className="bg-green-500 hover:bg-green-600 transition-transform transform ease-in-out hover:duration-400 text-2xl px-28 py-32 rounded-lg text-white"
                  onClick={handleCheckIn}
                >
                  Check in
                </button>
              ) : (
                <>
                  <button
                    className="bg-red-500 hover:bg-red-600 transition-transform transform ease-in-out hover:duration-400 text-2xl px-24 py-32 rounded-lg text-white"
                    onClick={handleCheckOut}
                  >
                    {" "}
                    Check out?
                  </button>
                  {elapsedTime !== "Invalid date" && (
                    <p className="mt-10 text-4xl">{elapsedTime} in Cafe!</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
