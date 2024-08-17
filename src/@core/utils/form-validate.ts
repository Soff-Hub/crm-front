function formValidate(formId: string, setError: any, reqiuredFields: string[]): any {
  const form: HTMLFormElement | null = document.getElementById(formId) as HTMLFormElement
  if (!form) {
    return false
  }

  const formData = new FormData(form)

  for (const [key, value] of formData.entries()) {
    if (value === '' && reqiuredFields.includes(key)) {
      setError((prevErrors: any) => ({
        ...prevErrors,
        [key]: {
          error: true,
          message: 'Kiritish talab qilinadi'
        }
      }))
    }
  }

  for (const [key, value] of formData.entries()) {
    if (value === '' && reqiuredFields.includes(key)) {
      return false
    }
  }

  return true
}

export default formValidate
