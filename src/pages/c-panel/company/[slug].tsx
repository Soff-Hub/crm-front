import { GetServerSidePropsContext } from 'next/types';
import EditCompany from 'src/@core/components/c-panel/companyDetails/EditCompany';


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