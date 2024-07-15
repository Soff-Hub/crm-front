import React, { useContext } from 'react'
import Calendar from './Calendar'
import DashboardStats from './DashboardStats'
import DashboardNumbers from './DashboardNumbers'
import { AuthContext } from 'src/context/AuthContext'

export default function DashboardPage() {
    const { user } = useContext(AuthContext)
    return (
        <>
            <DashboardStats />
            <Calendar />
            {user?.role.includes('ceo') && <DashboardNumbers />}
        </>
    )
}
