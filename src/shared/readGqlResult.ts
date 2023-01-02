import { BackendMethod, remult } from 'remult'
import { Event, Group, groupsInSearch, Search, Topic } from './entities'
import { gqlResult } from './gql'
export class ReadGql {
  @BackendMethod({ allowed: true, blockUser: false })
  static async readGqlResult(json: gqlResult, searchTerm: string) {
    let edges = json.data.keywordSearch.edges;
    return await loadDataArray(searchTerm, edges);
  }

}

export async function loadDataArray(searchTerm: string, edges: import("c:/Repos/read-meetup/src/shared/gql").Edge[]) {
  var search = await remult.repo(Search).insert({ searchTerm });
  let newGroups = 0;
  let i = 0;
  for (const { node } of edges) {
    var groupInfo = node.result;
    console.log(`${++i}/${edges.length} - ${groupInfo.name}`);
    const group = await remult.repo(Group).findFirst(
      {
        id: groupInfo.id
      },
      { createIfNotFound: true }
    );
    if (group.isNew())
      newGroups++;
    await group.assign({
      name: groupInfo.name,
      city: groupInfo.city,
      country: groupInfo.country,
      description: groupInfo.description,
      link: groupInfo.link,
      members: groupInfo.stats.memberCounts.all,
      state: groupInfo.state,
      longitude: groupInfo.longitude,
      latitude: groupInfo.latitude,
      organizer: groupInfo.organizer?.name,
      organizerEmail: groupInfo.organizer?.email,
      topicCategory: groupInfo.topicCategory?.name ?? ""
    }).save();
    await remult.repo(groupsInSearch).insert({
      searchId: search.id,
      groupId: group.id
    });
    for (const topic of groupInfo.topics) {
      await (await remult.repo(Topic).findFirst({
        groupId: group.id,
        topicId: topic.id
      }, { createIfNotFound: true })).assign({
        name: topic.name
      }).save();
    }
    for (const { node } of groupInfo.unifiedEvents.edges) {
      await (await remult.repo(Event).findFirst({
        groupId: group.id,
        eventId: node.id
      }, { createIfNotFound: true })).assign({
        dateTime: node.dateTime,
        description: node.description,
        eventType: node.eventType,
        going: node.going,
        shortDescription: node.shortDescription ?? "",
        shortUrl: node.shortUrl,
        title: node.title
      }).save();
    }
    for (const { node } of groupInfo.pastEvents.edges) {
      await (await remult.repo(Event).findFirst({
        groupId: group.id,
        eventId: node.id
      }, { createIfNotFound: true })).assign({
        dateTime: node.dateTime,
        description: node.description,
        eventType: node.eventType,
        going: node.going,
        shortDescription: node.shortDescription ?? "",
        shortUrl: node.shortUrl,
        title: node.title,
        pastEvent: true
      }).save();
    }
    for (const { node } of groupInfo.upcomingEvents.edges) {
      await (await remult.repo(Event).findFirst({
        groupId: group.id,
        eventId: node.id
      }, { createIfNotFound: true })).assign({
        dateTime: node.dateTime,
        description: node.description,
        eventType: node.eventType,
        going: node.going,
        shortDescription: node.shortDescription ?? "",
        shortUrl: node.shortUrl,
        title: node.title
      }).save();
    }
  }
  await search.assign({ newGroups }).save();
  console.log("done ", { newGroups });
  return newGroups;
}
