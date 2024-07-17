// ** React Imports
import { useContext } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Hook Import
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch } from 'src/store'
import { AuthContext } from 'src/context/AuthContext'
import { setGlobalPay } from 'src/store/apps/students'
import GlobalPaymentModal from 'src/views/apps/students/GlobalPaymentModal'

const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
    right: 0,
    top: '30%',
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    gap: '2px',
    position: 'fixed',
    zIndex: theme.zIndex.modal,
    padding: theme.spacing(1),
    transform: 'translateY(-50%)',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius
}))

const GlobalPay = () => {
    const dispatch = useAppDispatch()
    const { user } = useContext(AuthContext)

    function clickGlobalPay() {
        dispatch(setGlobalPay(true))
    }

    return (
        <div className='customizer'>
            {(user?.role.includes('admin') || user?.role.includes('ceo')) && <Toggler onClick={clickGlobalPay}>
                <IconifyIcon fontSize={18} icon={'weui:add-outlined'} />
                <span>To'lov</span>
            </Toggler>}
            <GlobalPaymentModal />
        </div>
    )
}

export default GlobalPay
