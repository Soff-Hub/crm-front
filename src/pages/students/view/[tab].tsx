import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next/types'
import UserViewPage from 'src/views/apps/students/view/UserViewPage'

const UserView = ({ tab }: InferGetStaticPropsType<typeof getServerSideProps>) => {
  return <UserViewPage tab={tab} />
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query, params } = context;

  return {
    props: {
      students: query?.student || null,
      tab: params?.tab
    },
  };
}

export default UserView
