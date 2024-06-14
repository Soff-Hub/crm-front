import React from 'react'
import UserViewSecurity from 'src/views/apps/groups/view/UserViewSecurity'
import StudentGroupDetail from 'src/views/apps/student-profile/StudentGroupDetail'


function Groups(props: any) {

    return (
        <div>
            <StudentGroupDetail {...props} />
        </div>
    )
}

export function getServerSideProps(context: any) {
    const { params, query } = context

    return {
        props: {
            slug: params.slug,
            month: query?.month,
            month_duration: query?.month_duration,
            start_date: query?.start_date,
        }
    }
}

export default Groups