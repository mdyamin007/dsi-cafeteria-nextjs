"use client"
import Card from './CardAdmin'

const AdminQueue = ({ occupantList }) => {
    return (
        <div className="flex flex-col items-center justify-center mx-6">
            {occupantList && occupantList.map(occupant => (
                <Card key={occupant.uid} occupant={occupant} />
            ))}
        </div>
    )
}

export default AdminQueue