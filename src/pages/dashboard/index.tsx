"use client";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { AuthContext } from 'src/context/AuthContext';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchLessons, fetchStatistics } from 'src/store/apps/dashboard';

const MyGroups = dynamic(() => import('src/views/my-groups'), { ssr: false });
const DashboardPage = dynamic(() => import('src/views/apps/dashboard/DashboardPage'), { ssr: false });

const AppCalendar = () => {
  const { weeks } = useAppSelector((state) => state.dashboard)
  const dispatch = useAppDispatch()
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const pageLoad = async () => {
    if (!user?.role.includes('admin') && !user?.role.includes('ceo') && !user?.role.includes('teacher')) {
      router.push("/")
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
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
