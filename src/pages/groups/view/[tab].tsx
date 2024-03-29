import { GetServerSidePropsContext, GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import UserViewPage from 'src/views/apps/groups/view/UserViewPage'

const UserView = ({ tab }: any) => {

  return <UserViewPage tab={tab} />
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query, params } = context;

  return {
    props: {
      id: query.id,
      month: query.month,
      tab: params?.tab
    },
  };
}

export default UserView
