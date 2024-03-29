import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import UserViewPage from 'src/views/apps/groups/view/UserViewPage'

const UserView = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserViewPage tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'security' } },
      { params: { tab: 'exams' } },
      { params: { tab: 'notes' } },
      { params: { tab: 'discount' } },
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params, previewData }: GetStaticPropsContext) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default UserView
