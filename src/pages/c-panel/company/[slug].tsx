import { GetServerSidePropsContext } from 'next/types';
import React from 'react'
import CreateCeo from 'src/@core/components/c-panel/CreateCeo';
import EditCompany from 'src/@core/components/c-panel/EditCompany';


type Props = {
    tab: number
}


function Slug({ tab }: Props) {

    return (
        <div>
            <EditCompany slug={tab} />
            {/* <CreateCeo slug={tab}/> */}
        </div>
    )
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { params } = context;

    return {
        props: {
            tab: params?.slug
        },
    };
}


export default Slug