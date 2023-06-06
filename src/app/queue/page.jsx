"use client"
import { redirect } from "next/navigation";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/firebase/config";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

const Queue = () => {
    const [occupantList, setOccupantList] = useState(null)

    const { currentUser } = useAuth()

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

    if (!currentUser) {
        redirect("/");
    }

    return (
        <div className="my-2">
            <div className="flex flex-col items-center justify-center">
                {occupantList && occupantList.map(occupant => (
                    <div className="mx-auto md:mx-auto w-full md:w-1/2 my-2 border shadow-md px-3 py-4 flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-around" key={occupant.uid}>
                        <Image src={occupant.photoURL} alt="User picture" width={50} height={50} className="rounded-full" />
                        <p>{occupant.name}</p>
                        <p>{moment(occupant.timestamp).fromNow(true)}</p>
                    </div>
                ))}
                <Link href="/home" className="my-10 md:my-24 text-blue-600">Back to check in page</Link>
            </div>
        </div>
    )
}

export default Queue