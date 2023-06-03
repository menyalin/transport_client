import List from '@/pages/profile/scheduleNotes/list'
import Details from '@/pages/profile/scheduleNotes/details'

const BASE_PATH = 'schedule_notes'

export default [
  {
    path: BASE_PATH,
    name: 'ScheduleNoteList',
    component: List,
    meta: {
      permission: 'scheduleNote:readList',
    },
  },
  {
    path: BASE_PATH + '/create',
    name: 'ScheduleNoteCreate',
    component: Details,
    props: true,
    meta: {
      permission: 'scheduleNote:readItem',
    },
  },
  {
    path: BASE_PATH + '/:id',
    name: 'ScheduleNoteDetails',
    component: Details,
    props: true,
    meta: {
      permission: 'scheduleNote:readItem',
    },
  },
]
