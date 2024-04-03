import { useRouter } from "next/router";
import { useState } from "react"
import api from "src/@core/utils/api";
import { GroupType } from "src/@fake-db/types";
import ceoConfigs from "src/configs/ceo";



export default function useGroups() {
    const router = useRouter()
    const [groups, setGroups] = useState<any[]>([])
    const [groupData, setGroupData] = useState<GroupType | null>(null)
    const [groupShort, setGroupShort] = useState<{
        id: number
        name: string
        start_date: string
    }[] | null>(null)
    const [groupCount, setGroupCount] = useState<number>(0)

    const getGroups = async () => {
        try {
            const resp = await api.get(ceoConfigs.groups, { params: { ...router.query, status: router.query.status === undefined ? 'active' : router.query.status === 'all' ? '' : router.query.status } })
            setGroups(resp.data.results)
            setGroupCount(Math.ceil(resp.data.count / 10))
        } catch (err) {
            console.log(err)
        }
    }

    const getGroupShort = async (branch_id: any) => {
        try {
            const resp = await api.get(ceoConfigs.group_short_list + branch_id)
            setGroupShort(resp.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getGroupById = async (id: any) => {
        try {
            const resp = await api.get(ceoConfigs.groups_detail + id)
            setGroupData(resp.data)
        } catch (err) {
            console.log(err)
        }
    }

    const createGroup = async (data: any) => {
        try {
            const resp = await api.post(ceoConfigs.groups_create, data)

            return resp.data
        } catch (err) {

            return Promise.reject(err)
        }
    }

    const updateGroup = async (id: any, data: any) => {
        try {
            const resp = await api.patch(ceoConfigs.groups_update + id, data)

            return resp.data
        } catch (err) {

            return Promise.reject(err)
        }
    }

    const mergeStudentToGroup = async (data: any) => {
        try {
            const resp = await api.post(ceoConfigs.merge_student, data)

            return resp.data
        } catch (err) {

            return Promise.reject(err)
        }
    }


    return { groups, getGroups, getGroupById, groupData, createGroup, mergeStudentToGroup, setGroupData, groupCount, groupShort, getGroupShort, updateGroup }
}
