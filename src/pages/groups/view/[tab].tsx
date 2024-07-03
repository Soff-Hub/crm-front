import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next/types'
import UserViewPage from 'src/views/apps/groups/view/UserViewPage'

const UserView = ({ tab, month, id }: InferGetStaticPropsType<typeof getServerSideProps>) => {

  return <UserViewPage tab={tab} month={month} id={id} />
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query, params } = context;

  return {
    props: {
      id: query?.id || null,
      month: query?.month || null,
      tab: params?.tab
    },
  };
}

export default UserView
