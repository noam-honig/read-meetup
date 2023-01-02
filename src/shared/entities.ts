import { Entity, EntityBase, Fields, IdEntity } from 'remult'

@Entity('searches', { allowApiCrud: true })
export class Search extends IdEntity {
  @Fields.string()
  searchTerm = ''
  @Fields.integer()
  newGroups = 0
  @Fields.date()
  createDate = new Date()
}
@Entity('groupsInSearch')
export class groupsInSearch extends IdEntity {
  @Fields.string()
  searchId = ''
  @Fields.string()
  groupId = ''
}

@Entity('groups', { allowApiCrud: true })
export class Group extends EntityBase {
  @Fields.string()
  id = ''
  @Fields.string()
  name = ''
  @Fields.string()
  link = ''
  @Fields.string()
  city = ''
  @Fields.string()
  state = ''
  @Fields.string()
  country = ''
  @Fields.string({
    maxLength: 4000
  })
  description = ''
  @Fields.string()
  organizer = ''
  @Fields.string()
  organizerEmail = ''
  @Fields.integer()
  members = 0
  @Fields.string()
  topicCategory = ''
  @Fields.number()
  latitude = 0
  @Fields.number()
  longitude = 0
  @Fields.boolean()
  hide = false
  @Fields.date()
  createDate = new Date()
}
@Entity<Topic>('topics', {
  allowApiCrud: true,
  id: (c) => [c.groupId, c.topicId]
})
export class Topic extends EntityBase {
  @Fields.string()
  groupId = ''
  @Fields.string()
  topicId = ''
  @Fields.string()
  name = ''
}

@Entity<Event>('events', {
  allowApiCrud: true,
  id: (c) => [c.groupId, c.eventId]
})
export class Event extends EntityBase {
  @Fields.string()
  groupId = ''
  @Fields.string()
  eventId = ''
  @Fields.string()
  title = ''
  @Fields.string()
  dateTime = ''
  @Fields.string()
  eventType = ''
  @Fields.integer()
  going = 0
  @Fields.string({ maxLength: 4000 })
  description = ''
  @Fields.string()
  shortDescription = ''
  @Fields.string()
  shortUrl = ''
  @Fields.date()
  createDate = new Date()
  @Fields.boolean()
  pastEvent = false
}
