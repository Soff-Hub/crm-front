const ceoConfigs = {
  employee: 'auth/employees/',
  employee_detail: 'auth/detail/employee/',
  employee_create: 'auth/create/employee/',
  employee_update: 'auth/update/employee/',
  employee_delete: 'auth/delete/employee/',

  courses: 'common/courses/',
  courses_posts: 'common/course/create',
  courses_delete: 'common/course/delete',
  courses_update: 'common/course/update',
  courses_detail: 'common/course/detail',

  barnchs: 'common/branches/',

  teachers: 'auth/teachers/',

  rooms_posts: 'common/room/create',
  rooms_update: 'common/room/update',
  rooms: 'common/rooms/',
  rooms_detail: 'common/room/detail',
  rooms_delete: 'common/room/delete',

  groups: 'common/groups/',
  groups_detail: 'common/group/detail/',
  groups_create: 'common/group-create/',
  groups_update: 'common/group/update/',
  groups_updateStatus: 'common/group/update/status/',
  merge_student: 'common/group-student-create/',
  group_short_list: 'common/group-check-list/?branch=',

  students: 'student/list/',
  students_detail: 'student/detail/',
  students_update: 'student/update/',
  students_create: 'student/create/',
  students_delete: 'auth/student-destroy/',

  attendances: 'common/attendance-report/'
}

export default ceoConfigs
