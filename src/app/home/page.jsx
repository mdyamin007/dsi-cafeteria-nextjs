"use client";

import { redirect } from "next/navigation";
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
import Link from "next/link";
import NotificationPrompt from "../components/NotificationPrompt";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { useSelector } from "react-redux";

const Home = () => {
  const [totalOccupations, setTotalOccupations] = useState(0);
  const [isCheckedIn, setIsCheckedin] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkedInTime, setCheckedInTime] = useState("");
  const [elapsedTime, setElapsedTime] = useState("");
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  // const { logout, currentUser, loading } = useAuth();
  const { logout, user, loading } = useSelector(state => state.auth)

  // console.log(moment().format());

  const connectWithPusher = () => {
    if (user) {
      const beamsClient = new PusherPushNotifications.Client({
        instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID,
      });

      beamsClient
        .start()
        .then((beamsClient) => beamsClient.getDeviceId())
        .then((deviceId) =>
          console.log(
            "Successfully registered with Beams. Device ID:",
            deviceId
          )
        )
        .then(() => beamsClient.addDeviceInterest("cafeteria"))
        .then(() => beamsClient.getDeviceInterests())
        .then((interests) => console.log("Current interests:", interests))
        .catch(console.error);
    }
  };

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
      if (user) {
        const userRef = query(
          ref(database, "occupants"),
          orderByChild("email"),
          equalTo(user.email)
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

    const requestPermission = async () => {
      if (user) {
        if (
          Notification.permission === "default" ||
          Notification.permission === "denied"
        ) {
          // connectWithPusher();
          setShowNotificationPrompt(true);
        }
      }
    };

    requestPermission();
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

  if (!user) {
    redirect("/");
  }

  const handleCheckIn = () => {
    if (user) {
      const timestamp = moment().format();
      // console.log(timestamp);
      const occupantsRef = ref(database, "occupants");
      const newOccupantRef = push(occupantsRef);
      let data = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        timestamp: timestamp,
      };
      set(newOccupantRef, data);
    }
  };

  const handleCheckOut = () => {
    if (user) {
      console.log("Checking out");
      const userRef = query(
        ref(database, "occupants"),
        orderByChild("uid"),
        equalTo(user.uid)
      );
      onValue(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            remove(
              ref(database, "occupants/" + Object.keys(snapshot.val())[0])
            );
          }
        },
        { onlyOnce: true }
      );
      setCheckedInTime("");
      setIsCheckedin(false);
    }
  };

  if (showNotificationPrompt) {
    return (
      <NotificationPrompt
        setShowNotificationPrompt={setShowNotificationPrompt}
        connectWithPusher={connectWithPusher}
      />
    );
  }

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
              {user && (
                <nav className="mt-6 md:ml-auto md:mr-auto flex md:hidden flex-wrap items-center text-base justify-center">
                  <Link
                    href="/queue"
                    className="mr-5 hover:text-gray-900 text-blue-700"
                  >
                    Open queue
                  </Link>
                </nav>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
