import React from 'react'

function MyGroups() {
    return (
        <div>MyGroups</div>
    )
}

MyGroups.acl = {
    action: 'manage',
    subject: 'my-group'
}


export default MyGroups