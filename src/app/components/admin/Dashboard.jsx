"use client"

import { database } from "@/firebase/config"
import { equalTo, onValue, orderByChild, query, ref, remove } from "firebase/database"
import moment from "moment"
import Image from "next/image"
import { useEffect, useState } from "react"
import AdminQueue from "./AdminQueue"

const Dashboard = ({ setIsAuthenticated }) => {
    const [occupantList, setOccupantList] = useState(null)

    useEffect(() => {
        const occupantsRef = ref(database, "occupants");
        onValue(occupantsRef, (snapshot) => {
            const data = snapshot.val();
            // console.log(Object.keys(snapshot.val()).length);
            if (data) {
                setOccupantList(Object.values(data).sort((a, b) => {
                    const timeA = moment(a.timestamp);
                    const timeB = moment(b.timestamp);
                    return timeA.diff(timeB);
                }))
            }
            else setOccupantList(null)
        })
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("adminUsername")
        localStorage.removeItem("adminPassword")
        setIsAuthenticated(false)
    }

    const handleRemove = (uid) => {
        console.log("removing");
        const userRef = query(
            ref(database, "occupants"),
            orderByChild("uid"),
            equalTo(uid)
        );
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                remove(ref(database, "occupants/" + Object.keys(snapshot.val())[0]))
            }
        }, { onlyOnce: true });

    }

    const handleClear = () => {
        remove(ref(database, "occupants"))
    }

    return (
        <>
            <div className="flex items-center justify-center my-4 md:my-10 gap-8">
                <button className="border border-red-600 rounded text-red-600 px-4 py-4" onClick={handleLogout}>Log out</button>
                <button className="rounded bg-red-400 px-4 py-4 inline-block text-white" onClick={handleClear}>Clear queue</button>
            </div>

            <AdminQueue occupantList={occupantList} />

        </>
    )
}

export default Dashboard