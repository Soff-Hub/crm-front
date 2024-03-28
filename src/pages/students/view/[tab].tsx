import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import UserViewPage from 'src/views/apps/students/view/UserViewPage'

const UserView = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserViewPage tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'security' } },
      { params: { tab: 'comments' } },
      { params: { tab: 'sms' } },
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default UserView
