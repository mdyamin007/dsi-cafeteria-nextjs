"use client"
import { redirect } from "next/navigation";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/firebase/config";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import Card from "../components/Card";

const Queue = () => {
    const [occupantList, setOccupantList] = useState(null)

    const { currentUser } = useAuth()

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

    if (!currentUser) {
        redirect("/");
    }

    return (
        <div className="w-full my-2 text-center">
            <div className="w-full flex flex-wrap gap-4 my-10 md:flex-row items-center justify-center">
                {occupantList && occupantList.map(occupant => (
                    <Card key={occupant.uid} occupant={occupant} />
                ))}
            </div>
            <Link href="/home" className="my-14 md:my-24 text-blue-600">Back to check-in page</Link>
        </div>

    )
}

export default Queue