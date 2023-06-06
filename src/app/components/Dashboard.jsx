"use client"

import { database } from "@/firebase/config"
import { equalTo, onValue, orderByChild, query, ref, remove } from "firebase/database"
import moment from "moment"
import Image from "next/image"
import { useEffect, useState } from "react"

const Dashboard = ({ setIsAuthenticated }) => {
    const [occupantList, setOccupantList] = useState(null)

    useEffect(() => {
        const occupantsRef = ref(database, "occupants");
        onValue(occupantsRef, (snapshot) => {
            const data = snapshot.val();
            // console.log(Object.keys(snapshot.val()).length);
            if (data) {
                setOccupantList(Object.values(data))
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
            <div className="flex md:flex-col flex-row">
                {occupantList && occupantList.map(occupant => (
                    <div className="mx-auto w-full md:w-1/2 my-2 border shadow-md px-3 py-4 classname flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-around" key={occupant.uid}>
                        <Image src={occupant.photoURL} alt="User picture" width={50} height={50} className="rounded-full" />
                        <p>{occupant.name}</p>
                        <p>{moment(occupant.timestamp).fromNow(true)}</p>
                        <button onClick={() => handleRemove(occupant.uid)} className=" px-4 py-2 font-light bg-red-600 text-white rounded-md">Remove</button>
                    </div>
                ))}
            </div>

        </>
    )
}

export default Dashboard