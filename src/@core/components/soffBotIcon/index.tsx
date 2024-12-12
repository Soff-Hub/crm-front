import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSoffBotText, toggleModal } from 'src/store/apps/page'
import { useAppSelector } from 'src/store'
import api from 'src/@core/utils/api'
import useResponsive from 'src/@core/hooks/useResponsive'

const DraggableIcon = ({ style, ...props }: { style?: React.CSSProperties }) => {
  const [position, setPosition] = useState({ top: 250, left: 250 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ top: 0, left: 0 })
  const dispatch = useDispatch()
  const { soffBotStatus, isModalOpen: isBotModalOpen } = useAppSelector(state => state.page)
  const { isMobile } = useResponsive()

  const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if ('clientX' in e) {
      return { x: e.clientX, y: e.clientY }
    }
    return { x: 0, y: 0 }
  }

  const handleStart = (
    e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>
  ) => {
    const nativeEvent = 'touches' in e ? e.touches[0] : e; 
    setDragStart({ top: nativeEvent.clientY, left: nativeEvent.clientX });
    setIsDragging(true);
    e.preventDefault();
  };
  
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (isDragging) {
      const nativeEvent = 'touches' in e ? e.touches[0] : e;
      const { clientX, clientY } = nativeEvent;
      const distanceMoved = Math.sqrt(
        Math.pow(clientY - dragStart.top, 2) + Math.pow(clientX - dragStart.left, 2)
      );
  
      if (distanceMoved > 10) {
        setPosition({
          top: clientY - 35,
          left: clientX - 35,
        });
      }
    }
  };
  
  const handleEnd = (e: MouseEvent | TouchEvent) => {
    if (isDragging) {
      const nativeEvent = 'touches' in e ? e.changedTouches[0] : e; 
      const { clientX, clientY } = nativeEvent;
      const distanceMoved = Math.sqrt(
        Math.pow(clientY - dragStart.top, 2) + Math.pow(clientX - dragStart.left, 2)
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
      if (window.location.pathname !== '/c-panel') {
        dispatch(toggleModal(true))
      }
    }
  }

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
      width={isMobile ? '40' : '70'}
      height={isMobile ? '40' : '70'}
      alt='Happy Bot'
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
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
