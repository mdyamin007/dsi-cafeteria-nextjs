"use client"
import Image from 'next/image'
import moment from 'moment'
import { useEffect, useState } from 'react'


const Card = ({ occupant }) => {
    const [timeElapsed, setTimeElapsed] = useState(0)

    useEffect(() => {
        const now = moment().format()
        // console.log(now);
        setTimeElapsed(moment(now).diff(occupant.timestamp, "minutes"))
    }, [])

    // console.log(timeElapsed);

    return (
        <div className={"w-full my-2 border shadow-md px-3 py-4 classname flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-around " + (timeElapsed > 15 ? "border-red-600" : "")}>
            <Image src={occupant.photoURL} alt="User picture" width={50} height={50} className="rounded-full" />
            <p>{occupant.name}</p>
            <p>{moment(occupant.timestamp).fromNow(true)}</p>
            <button onClick={() => handleRemove(occupant.uid)} className=" px-4 py-2 font-light bg-red-600 text-white rounded-md">Remove</button>
        </div>
    )
}

export default Card