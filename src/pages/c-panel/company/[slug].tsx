import { GetServerSidePropsContext } from 'next/types';
import React from 'react'
import CreateCompany from 'src/@core/components/c-panel/CreateCompany'


type Props = {
    tab: number
}


function Slug({ tab }: Props) {

    return (
        <div>
            <CreateCompany slug={tab} />
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