import { AbilityBuilder, Ability } from '@casl/ability'
export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'
export type AppAbility = Ability<[Actions, Subjects]> | undefined
export const AppAbility = Ability as any

export type ACLObj = {
  action: Actions
  subject: string
}

const defineRulesFor = (role: string[], subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  can('manage', 'all')

  return rules
}

export const buildAbilityFor = (role: string[], subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
