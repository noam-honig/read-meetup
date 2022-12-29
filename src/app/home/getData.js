function download(text, name) {
  type = 'application/json'
  var file = new Blob([text], { type: type });
  var a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
async function test(search) {
  let cursor = '';
  let i = 0;
  let all = [];
  while (true) {
    console.log({ search, cursor, length: all.length })
    let r = await get(search, cursor);
    all.push(...r.data.keywordSearch.edges)
    cursor = r.data.keywordSearch.pageInfo.endCursor;
    if (!cursor)
      break

  }
  download(JSON.stringify(all), search + '.json');

}

async function get(search, cursor) {
  const query = `#graphql
query searchGroups {
  keywordSearch(
    input: {first: 50
     ${cursor ? `after:"${cursor}"` : ''}
    }
    filter: {query: "${search}", lat: 51.5072, lon: 0.1276, radius: 20000, source: GROUPS}
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
            count
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
      count
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
            count
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

`
  return await fetch('https://api.meetup.com/gql', { method: 'POST', headers: { "Content-Type": 'application/json' }, body: JSON.stringify({ query }) }).then(x => x.json())
}

for (const what of ['javascript', 'angular', 'node', 'react', 'vue']) {
  await test(what)
}
