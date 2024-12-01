import { Pagination, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import { formatPhoneNumber } from 'src/@core/components/phone-input/format-phone-number'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchPaymetLogs, updateQueryParams } from 'src/store/apps/logs'
import SubLoader from 'src/views/apps/loaders/SubLoader'

export default function PaymentHistory() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const dispatch = useAppDispatch()
  const { isMobile } = useResponsive();
  const { t } = useTranslation()

  const { paymentCount, paymentLogs, isLoading } = useAppSelector(state => state.logs)

  async function handleSearch(search: string) {
    setSearch(search)
    dispatch(updateQueryParams({ search: search }))
  }

  const handlePaginate = (p: number) => {
    setPage(p)
    dispatch(updateQueryParams({ page: p }))
  }

  useEffect(() => {
    dispatch(fetchPaymetLogs(`page=${page}&search=${search}`))
  }, [page, search])

  return (
    <div>
      <TextField
        className='my-3'
        onChange={e => handleSearch(e.target.value)}
        size='small'
        label={t('Qidiruv')}
        variant='outlined'
      />
      {isLoading ? <SubLoader /> : ''}
      {!isLoading && paymentLogs.length == 0 ? (
        <EmptyContent />
      ) : (
        !isLoading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 10 : 40,
              marginTop: isMobile ? 0 : 30,
              alignItems: 'flex-start'
            }}
          >
            {paymentLogs.map(el => (
              <div
                className='payment-history-card'
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
                key={el.id} // Har bir element uchun `key` qo'shildi
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
                  {el.title}. {t("XODIM")}: {formatPhoneNumber(el?.admin_phone)} {el?.admin_name}
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
        )
      )}

      {Math.ceil(paymentCount / 15) > 1 && !isLoading && (
        <Pagination
          style={{ marginTop: '30px' }}
          defaultPage={page || 1}
          count={Math.ceil(paymentCount / 15)}
          variant='outlined'
          shape='rounded'
          page={page}
          onChange={(_, page) => handlePaginate(page)} // faqat `setPage` chaqiriladi
        />
      )}
    </div>
  )
}
