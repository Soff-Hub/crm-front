import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSoffBotText, toggleModal } from 'src/store/apps/page'
import { useAppSelector } from 'src/store'
import api from 'src/@core/utils/api'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'

const DraggableIcon = ({ style, ...props }: { style?: React.CSSProperties }) => {
  const [position, setPosition] = useState({ bottom: 100, right: 5 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ bottom: 0, right: 0 })
  const dispatch = useDispatch()
  const { soffBotStatus, isModalOpen: isBotModalOpen } = useAppSelector(state => state.page)
  const { isMobile } = useResponsive()
  const { user } = useContext(AuthContext)
  const handleStart = (
    e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>
  ) => {
    const nativeEvent = 'touches' in e ? e.touches[0] : e;
    setDragStart({ bottom: nativeEvent.clientY, right: nativeEvent.clientX });
    setIsDragging(true);
    e.preventDefault();
  };



  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (isDragging) {
      const nativeEvent = 'touches' in e ? e.touches[0] : e;
      const { clientX, clientY } = nativeEvent;

      const distanceMoved = Math.sqrt(
        Math.pow(clientY - dragStart.bottom, 2) + Math.pow(clientX - dragStart.right, 2)
      );

      if (distanceMoved > 10) {
        setPosition({
          bottom: window.innerHeight - clientY - 35,
          right: window.innerWidth - clientX - 35
        });
      }
    }
  };

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    if (isDragging) {
      const nativeEvent = 'touches' in e ? e.changedTouches[0] : e;
      const { clientX, clientY } = nativeEvent;

      const distanceMoved = Math.sqrt(
        Math.pow(clientY - dragStart.bottom, 2) + Math.pow(clientX - dragStart.right, 2)
      );

      setIsDragging(false);

      if (distanceMoved <= 10) {
        handleSingleClick();
      }
    }
  };

  const handleSingleClick = async () => {
    try {
      const res = await api.get('auth/analytics/')
      dispatch(
        setSoffBotText({
          missed_attendance: res.data.missed_attendance,
          groups: res.data.detail,
          absent_students: res.data.absent_students,
          income: res.data.income,
          new_leads: res.data.new_leads,
          robot_mood: res.data.robot_mood,
          sms_limit: res.data.sms_limit,
          unconnected_leads: res.data.unconnected_leads,
          summary: res.data?.summary,
          role: res?.data?.role,
          added_students: res.data?.added_students,
          left_students: res.data?.left_students,
          not_using_platform: res.data.not_using_platform
        })
      )
    } catch (error) {
      console.error(error)
    } finally {
      if (window.location.pathname !== '/c-panel' || user?.role.join(', ') !== 'student') {
        dispatch(toggleModal(true))
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleMove)
      window.addEventListener('touchend', handleEnd)
    } else {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging])

  return (
    <img
      src={
        soffBotStatus === -1
          ? '/images/avatars/sadbot.webp'
          : soffBotStatus === 0
          ? '/images/avatars/normalbot.webp'
          : '/images/avatars/happybot.webp'
      }
      width={isMobile ? '30' : '45'}
      height={isMobile ? '30' : '45'}
      alt='Happy Bot'
      style={{
        position: 'fixed',
        bottom: `${position.bottom}px`,
        right: `${position.right}px`,
        zIndex: isBotModalOpen ? 100 : 9999,
        cursor: 'pointer',
        ...style
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      {...props}
    />
  )
}

export default DraggableIcon
