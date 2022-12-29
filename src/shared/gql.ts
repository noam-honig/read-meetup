

export interface PageInfo {
  endCursor: string;
}

export interface MemberCounts {
  all: number;
}

export interface Stats {
  memberCounts: MemberCounts;
}

export interface Topic {
  id: string;
  name: string;
}

export interface TopicCategory {
  id: string;
  name: string;
}

export interface EventInfo {
  id: string;
  title: string;
  dateTime: string;
  eventType: string;
  going: number;
  description: string;
  shortDescription?: any;
  shortUrl: string;
}

export interface Edge2 {
  node: EventInfo;
}

export interface UnifiedEvents {
  edges: Edge2[];
}

export interface GroupInfo {
  id: string;
  name: string;
  link: string;
  city: string;
  state: string;
  country: string;
  foundedDate: any;
  description: string;
  latitude: number;
  longitude: number;
  stats: Stats;
  topics: Topic[];
  topicCategory: TopicCategory;
  pastEvents: UnifiedEvents;
  unifiedEvents: UnifiedEvents;
  upcomingEvents: UnifiedEvents;
}

export interface Node {
  id: string;
  result: GroupInfo;
}

export interface Edge {
  node: Node;
}

export interface KeywordSearch {
  count: number;
  pageInfo: PageInfo;
  edges: Edge[];
}

export interface Data {
  keywordSearch: KeywordSearch;
}

export interface gqlResult {
  data: Data;
}

/*

query searchGroups {
  keywordSearch(
    input: {first: 200
     # after:"cmVjU291cmNlOmdyb3VwLXNlYXJjaCxpbmRleDoyMDA="
    }
    filter: {query: "vue", lat: 51.5072, lon: 0.1276, radius: 20000, source: GROUPS}
  ) {
    count
    pageInfo {
      endCursor
    }
    edges {
      node {
        id
       result{
        ... on Group{
          id
          name,
          link
          city
          state
          country
          foundedDate
          description
          latitude
          longitude
          stats{
            memberCounts{
              all
            }
         }
          topics{
            id
            name
          }
          topicCategory{
            id
            name
          }
          pastEvents(input: {first: 200}) {
      edges {
        node {
          id
          title
          dateTime
          eventType
          going
          description
          shortDescription
          shortUrl
        }
      }
    }
    upcomingEvents(input: {first: 200}) {
      edges {
        node {
          id
          title
          dateTime
          eventType
          going
          description
          shortDescription
          shortUrl
        }
      }
    }
    
          unifiedEvents{
            edges{
              node{
                id
                title
                dateTime
                eventType
                going
                description
                shortDescription
                shortUrl
              }
            }
          }
        }
      }
      }
    }
  }
}

*/