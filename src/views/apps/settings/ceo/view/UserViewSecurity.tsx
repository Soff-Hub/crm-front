
const UserViewSecurity = () => {

  return (
    <div className='demo-space-y'>
      {
        Array(6).fill(0).map((_, index) => (
          <div key={index} className='d-flex justify-content-between align-items-center bg-warning text-white px-4 pt-3 rounded-3' >
            <div className=' m-0 p-0'>
              <h6> Talabalar tashrifi olib tashlandi</h6>
              <p>Ozodbek ・ (93) 567-02-85</p>
            </div>
            <div className=' m-0 p-0'>
              <h6>07.02.2024 18:56:03</h6>
              <p>Ozodbek </p>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default UserViewSecurity
