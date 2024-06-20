"use client";
import { useContext, useEffect } from 'react';
import { AuthContext } from 'src/context/AuthContext';
import MyGroups from 'src/views/my-groups';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchLessons, fetchStatistics } from 'src/store/apps/dashboard';
import DashboardPage from 'src/views/apps/dashboard/DashboardPage';

const AppCalendar = () => {
  const { weeks } = useAppSelector((state) => state.dashboard)
  const dispatch = useAppDispatch()
  const { user } = useContext(AuthContext)

  const pageLoad = async () => {
    await Promise.all([
      dispatch(fetchStatistics()),
      dispatch(fetchLessons(weeks))
    ]);
  };

  useEffect(() => {
    pageLoad()
  }, [])

  return user?.role.length === 1 && user?.role.includes('teacher') ?
    <MyGroups /> :
    <DashboardPage />
}

export default AppCalendar
