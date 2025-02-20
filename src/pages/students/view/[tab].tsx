import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next/types'
import UserViewPage from 'src/views/apps/students/view/UserViewPage'

const UserView = ({ tab, student }: InferGetStaticPropsType<typeof getServerSideProps>) => {
  return <UserViewPage tab={tab} student={student} />
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query, params } = context;

  return {
    
    props: {
      student: Number(query?.student) || null,
      tab: params?.tab
    },
  };
}

export default UserView
