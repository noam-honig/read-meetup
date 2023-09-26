import { remultExpress } from 'remult/remult-express'
import { createPostgresConnection } from 'remult/postgres'
import { User } from '../app/users/user'
import { SignInController } from '../app/users/SignInController'
import { UpdatePasswordController } from '../app/users/UpdatePasswordController'
import { createKnexDataProvider } from 'remult/remult-knex'

import fs from 'fs'
import { loadDataArray, ReadGql } from '../shared/readGqlResult'
import { Edge, GroupInfo } from '../shared/gql'

export const api = remultExpress({
  entities: [User],
  controllers: [SignInController, UpdatePasswordController, ReadGql],
  getUser: (request) => request.session!['user'],
  dataProvider: undefined /* createKnexDataProvider(
    {
      client: 'mssql',
      debug: false,
      connection: {
        server: process.env['SQL_SERVER']!,
        database: process.env['SQL_DATABASE']!,
        user: process.env['SQL_USER']!,
        password: process.env['SQL_PASSWORD']!,
        options: {
          enableArithAbort: true,
          encrypt: false,
          instanceName: process.env['SQL_INSTANCE']!
        }
      }
    },
    true
  )*/,
  initApi: async () => {
    console.log('123')
    console.log(fs.readdirSync('./tmp'))
    let result: GroupInfo[] = []
    for (const file of fs.readdirSync('./tmp')) {
      const arr = JSON.parse(
        fs.readFileSync('./tmp/' + file).toString()
      ) as Edge[]
      result.push(
        ...arr
          .filter((x) => !result.find((f) => f.id === x.node.id))
          .map((y) => y.node.result)
      )
    }
    for (const x of result) {
      let events = [...x.unifiedEvents.edges, ...x.pastEvents.edges]
      events.sort((a, b) => b.node.dateTime.localeCompare(a.node.dateTime))
      events = events.filter(
        (x) =>
          x.node.dateTime < new Date().toISOString() &&
          x.node.eventType == 'PHYSICAL'
      )
      x.lastEvent = events[0]?.node
    }
    result = result.filter((x) => (x.lastEvent?.dateTime || '') >= '2023')
    result.sort((a, b) => (b.lastEvent?.going || 0) - (a.lastEvent?.going || 0))

    console.table(
      result.map((x) => {
        return {
          name: x.name,
          url: x.link,
          lastEventDate: x.lastEvent?.dateTime,
          going: x.lastEvent?.going,
          //org: x.organizer.name,
          email: x.organizer.email
        }
      })
    )
    return

    // let result: Edge[] = []
    // for (const what of ['node.js']) {
    //   //'javascript', 'angular', 'node', 'react', 'vue']) {
    //   let data: Edge[] = JSON.parse(
    //     fs.readFileSync(`./tmp/${what}.json`).toString()
    //   )
    //   result.push(...data.filter((x) => x.node.id === '1603209'))
    //   await loadDataArray(what, data)
    // }
    // fs.writeFileSync('./tmp/tm.json', JSON.stringify(result, undefined, 2))
    //  await readGqlResult(JSON.parse(fs.readFileSync('./tmp/result.json').toString()), "react");
  }
})
