import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import { useDispatch } from 'react-redux'
import { setSoffBotText, toggleModal } from 'src/store/apps/page'
import { useAppSelector } from 'src/store'
import api from 'src/@core/utils/api'
import useRoles from 'src/hooks/useRoles'

const DraggableIcon = () => {
  const [position, setPosition] = useState({ top: 250, left: 250 })
  const [isDragging, setIsDragging] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()
  const { soffBotStatus } = useAppSelector(state => state.page)
  const { roles } = useRoles()
  let last_login = localStorage.getItem('last_login')
  let clickTimeout: NodeJS.Timeout | null = null
  let startPosition = { top: 0, left: 0 }
  let isMoving = false

    

  const is_ceo = roles.find((item: any) => item.name == 'CEO' && item.is_active)
  const is_teacher = roles.find((item: any) => item.name == 'TEACHER' && item.is_active)

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      clickTimeout = null
    }

    startPosition = { top: e.clientY, left: e.clientX }
    setIsDragging(true)
    isMoving = false
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const distanceMoved = Math.sqrt(
        Math.pow(e.clientY - startPosition.top, 2) + Math.pow(e.clientX - startPosition.left, 2)
      )

      if (distanceMoved > 10) {
        isMoving = true
      }

      setPosition({
        top: e.clientY - 35,
        left: e.clientX - 35
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    if (!isMoving) {
      dispatch(toggleModal(true))
    }
    isMoving = false
  }

  

  const handleSingleClick = async () => {
    if (!isMoving) {
      dispatch(toggleModal(true))
      await api
        .get('auth/analytics/')
        .then(res => {
         if (res.data.role == "teacher") {
            dispatch(setSoffBotText({ missed_attendance: res.data.missed_attendance, groups: res.data.detail }))
          } 
        else if (res.data.role == "ceo") {
            dispatch(
              setSoffBotText({
                absent_students: res.data.absent_students,
                attending_the_class: res.data.attending_the_class,
                income: res.data.income,
                new_leads: res.data.new_leads,
                robot_mood: res.data.robot_mood,
                sms_limit: res.data.sms_limit,
                unconnected_leads: res.data.unconnected_leads
              })
            )
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    isMoving = false
  }

  const handleDoubleClick = () => {
    setIsDragging(true)
  }

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      clickTimeout = null
      handleDoubleClick()
    } else {
      clickTimeout = setTimeout(() => {
        handleSingleClick()
        clickTimeout = null
      }, 300)
    }
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
            ? '/images/avatars/sadbot.png'
            : soffBotStatus === 0
            ? '/images/avatars/normalbot.png'
            : '/images/avatars/happybot.png'
        }
        width='70'
        height='70'
        alt='Happy Bot'
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 99999,
          cursor: 'pointer'
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 id='modal-title'>Happy Bot Modal</h2>
          <p id='modal-description'>This is a modal triggered by a single click.</p>
        </div>
      </Modal>
    </>
  )
}

export default DraggableIcon
