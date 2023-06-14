"use client"
import moment from 'moment'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Card = ({ occupant }) => {
    const [timeElapsed, setTimeElapsed] = useState(0)

    useEffect(() => {
        const now = moment().format()
        // console.log(now);
        setTimeElapsed(moment(now).diff(occupant.timestamp, "minutes"))
    }, [])

    return (
        <div className={"w-full md:w-1/6 my-2 border shadow-md px-3 py-8 flex flex-col space-y-2 items-center justify-around " + (timeElapsed > 30 ? "border-red-600" : "")}>
            <Image src={occupant.photoURL} alt="User picture" width={50} height={50} className="rounded-full" />
            <p>{occupant.name}</p>
            <p>{moment(occupant.timestamp).fromNow(true)}</p>
        </div>
    )
}

export default Card