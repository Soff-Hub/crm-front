import { GroupType } from 'src/@fake-db/types'

export interface IGroupsState {
  isOpenEdit: boolean
  groups: GroupType | null
  groupCount: number
  isDeleting: boolean
  isLoading: boolean
}
