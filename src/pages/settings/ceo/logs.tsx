import { Pagination } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EmptyContent from 'src/@core/components/empty-content'
import { formatPhoneNumber } from 'src/@core/components/phone-input/format-phone-number'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'

export default function Logs() {
  const [data, setData] = useState<
    {
      title: string
      text: string
      user_name: string
      user_phone: string
      admin_name: string
      admin_phone: string
      date: string
    }[]
  >([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)

  const { isMobile } = useResponsive()

  const getHistory = async (p: number) => {
    scrollTo(0, 0)
    try {
      const resp = await api.get(`auth/student/logs/?page=${p}`)
      setData(resp.data?.results)
      setCount(resp.data?.count)
    } catch (err: any) {}
  }

  useEffect(() => {
    getHistory(page)
  }, [])

  return (
    <div>
      {data.length > 0 ? '' : <EmptyContent />}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 10 : 40,
          marginTop: isMobile ? 0 : 30,
          alignItems: 'flex-start'
        }}
      >
        {data.map(el => (
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '14px',
              position: 'relative',
              display: 'flex',
              gap: isMobile ? 10 : '30px',
              flexDirection: isMobile ? 'column' : 'row',
              maxWidth: '600px',
              width: '100%'
            }}
          >
            <p
              style={{
                position: isMobile ? 'relative' : 'absolute',
                top: isMobile ? 0 : '-30px',
                backgroundColor: 'white',
                padding: isMobile ? 0 : '6px 20px',
                left: 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                fontSize: '14px',
                margin: '0 0 4px'
              }}
            >
              {el.title}. XODIM: {formatPhoneNumber(el?.admin_phone)} {el?.admin_name}
            </p>

            <div>
              <p style={{ fontSize: '14px', margin: '0 0 4px' }}>{el.user_name}</p>

              <p style={{ fontSize: '14px', margin: '0 0 4px' }}>{el.user_phone}</p>

              <p style={{ fontSize: '14px', margin: '0 0 4px' }}>{el.date}</p>
            </div>

            <div>
              {el?.text.split('\n').map((line, index) => (
                <p style={{ fontSize: '14px', margin: '0 0 4px' }} key={index}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      {Math.ceil(count / 15) > 1 && data?.length && (
        <Pagination
          style={{ marginTop: '30px' }}
          defaultPage={page || 1}
          count={Math.ceil(count / 15)}
          variant='outlined'
          shape='rounded'
          page={page}
          onChange={(_: any, page) => setPage(page)}
        />
      )}
    </div>
  )
}
