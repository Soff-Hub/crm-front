import dynamic from 'next/dynamic';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next/types';

const UserViewPage = dynamic(() => import('src/views/apps/groups/view/UserViewPage'), { ssr: false });

const UserView = ({ tab, month, id }: InferGetStaticPropsType<typeof getServerSideProps>) => {

  return <UserViewPage />
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
