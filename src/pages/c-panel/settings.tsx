import React from 'react'
import CompanySmsPlanList from 'src/@core/components/c-panel/CompanySmsPlanList'
import CompanyStudentPlan from 'src/@core/components/c-panel/CompanyStudentPlan'


export default function Settings() {
    return (
        <div>
            <CompanySmsPlanList />
            <CompanyStudentPlan />
        </div>
    )
}