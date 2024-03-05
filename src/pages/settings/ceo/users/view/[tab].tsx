import { useRouter } from 'next/router'
import UserViewPage from 'src/views/apps/settings/ceo/view/UserViewPage'

const UserView = () => {
    const router = useRouter()

    const url = `${router.query.tab}`

    return <UserViewPage tab={url} invoiceData={[]} />
}


export default UserView
