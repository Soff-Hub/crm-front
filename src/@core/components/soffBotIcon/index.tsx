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
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)
  const dispatch = useDispatch()
  const { soffBotStatus, isModalOpen: isBotModalOpen } = useAppSelector(state => state.page)
  const {isMobile} = useResponsive()
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    setDragStart({ top: e.clientY, left: e.clientX })
    setIsDragging(true)
    e.preventDefault()
  }


  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const distanceMoved = Math.sqrt(Math.pow(e.clientY - dragStart.top, 2) + Math.pow(e.clientX - dragStart.left, 2))

      if (distanceMoved > 10) {
        setPosition({
          top: e.clientY - 35,
          left: e.clientX - 35
        })
      }
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      const distanceMoved = Math.sqrt(Math.pow(e.clientY - dragStart.top, 2) + Math.pow(e.clientX - dragStart.left, 2))

      setIsDragging(false)

      if (distanceMoved <= 10) {
        handleSingleClick()
      }
    }
  }

  const handleSingleClick = async () => {
    if (clickTimeout) return

    const timeout = setTimeout(async () => {
      try {
        const res = await api.get('auth/analytics/')
        if (res.data.role === 'admin') {
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
        }
       else if (res.data.role === 'ceo') {
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
        }  else if (res.data.role === 'teacher') {
          dispatch(
            setSoffBotText({
              missed_attendance: res.data.missed_attendance,
              groups: res.data.detail,
              summary: res.data?.summary,
              role: res?.data?.role,
              not_using_platform: res.data.not_using_platform
            })
            
          )
        
        }
      } catch (error) {
        console.error(error)
      } finally {
         if (window.location.pathname !== '/c-panel') {
           dispatch(toggleModal(true))
           setClickTimeout(null)
          }
        
      }
    }, 300)
    setClickTimeout(timeout)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <>
      <img
        src={
          soffBotStatus === -1
            ? '/images/avatars/sadbot.webp'
            : soffBotStatus === 0
            ? '/images/avatars/normalbot.webp'
            : '/images/avatars/happybot.webp'
        }
        width={isMobile ? '40':'70'}
        height={isMobile ? '40':'70'}
        alt='Happy Bot'
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: isBotModalOpen == true ? 100 : 9999,
          cursor: 'pointer',
          ...style
        }}
        {...props}
        onMouseDown={handleMouseDown}
      />
    </>
  )
}

export default DraggableIcon
