
function showResponseError(error: any, setError: any): any {
    Object.keys(error).map((el: any) => (
        setError((prevErrors: any) => ({
            ...prevErrors,
            [el]: {
                error: true,
                message: error[el]
            }
        }))
    ))
}

export default showResponseError
