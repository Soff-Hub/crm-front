import React, { CSSProperties, ReactNode } from 'react'
import formValidate from 'src/@core/utils/form-validate'

interface FormTypes {
  children?: ReactNode
  setError?: any
  onSubmit: any
  reqiuredFields?: string[] | undefined
  id: string
  sx?: CSSProperties
  valueTypes?: 'json' | 'form-data'
}

export default function Form({ children, sx, id, setError, onSubmit, reqiuredFields, valueTypes }: FormTypes) {
  async function handleSubmit(e: any) {
    e.preventDefault()

    if (reqiuredFields && !formValidate(id, setError, reqiuredFields)) return
    const form: any = document.getElementById(id)
    const formData = new FormData(form)
    if (valueTypes === 'form-data') {
      onSubmit(formData)
    } else {
      const values = {}
      for (const [key, value] of formData) {
        Object.assign(values, { [key]: value })
      }
      onSubmit(values)
    }
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      style={sx}
      onChange={(e: any) => e.target.addEventListener('input', setError?.({}))}
    >
      {children}
    </form>
  )
}
