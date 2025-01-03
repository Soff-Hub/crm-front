import { LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useBranches from 'src/hooks/useBranch'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchGroups, handleChangeBranchOpenEdit } from 'src/store/apps/groups'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'

export default function GroupChangeBranchModal() {
  const { isChangeBranchEdit, queryParams, groupData } = useAppSelector(state => state.groups)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { getBranches, branches } = useBranches()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getBranches()
  }, [])

  console.log(groupData)

  const validationSchema = Yup.object().shape({
    branchId: Yup.string().required(t('Filialni tanlash majburiy!') || 'Filialni tanlash majburiy!')
  })

  const formik = useFormik({
    initialValues: {
      branchId: ''
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      await api
        .post(`common/group/branch-update/`, {
          branch: values.branchId,
          group: groupData?.id
        })
        .then(res => {
          dispatch(fetchGroups(queryParams))
          toast.success("Guruh muvaffaqiyatli ko'chirildi")
          setLoading(false)
          formik.resetForm()
          dispatch(handleChangeBranchOpenEdit(false))
        })
        .catch(err => {
          console.log(err.response.data.msg)
          setLoading(false)
          toast.error(err.response.data.msg || err.response.data || 'xatolik')
        })
    }
  })

  function handleClose() {
    dispatch(handleChangeBranchOpenEdit(false))
    formik.resetForm()
  }

  return (
    <Dialog
      fullWidth
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450 } }}
      open={isChangeBranchEdit}
      onClose={handleClose}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography>{t("Boshqa filialga o'tkazish")}</Typography>
        </DialogTitle>
        <DialogContent>
          <FormControl
            sx={{ marginTop: 2 }}
            fullWidth
            error={formik.touched.branchId && Boolean(formik.errors.branchId)}
          >
            <InputLabel id='branch-select-label'>{t('Filialni tanlang')}</InputLabel>
            <Select
              labelId='branch-select-label'
              id='branch-select'
              name='branchId'
              value={formik.values.branchId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label={t('Filialni tanlang')}
            >
              {branches.map(branch => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.branchId && formik.errors.branchId && (
              <Typography sx={{ marginTop: 2 }} variant='caption' color='error'>
                {formik.errors.branchId}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button color='secondary' variant='outlined' type='button' onClick={handleClose}>
            {t('Bekor qilish')}
          </Button>
          <LoadingButton type='submit' variant='contained' disabled={loading || !formik.isValid} sx={{ mr: 1 }}>
            {t('Saqlash')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
