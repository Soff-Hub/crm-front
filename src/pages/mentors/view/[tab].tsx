import dynamic from 'next/dynamic';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next/types';
const UserViewPage = dynamic(() => import('src/views/apps/mentors/view/UserViewPage'));

const UserView = ({ tab }: InferGetStaticPropsType<typeof getServerSideProps>) => {
  return <UserViewPage tab={tab} />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query, params } = context;

  return {
    props: {
      id: query?.id || null,
      tab: params?.tab
    },
  };
}

export default UserView
