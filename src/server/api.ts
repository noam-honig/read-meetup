import { remultExpress } from 'remult/remult-express';
import { createPostgresConnection } from 'remult/postgres';
import { User } from '../app/users/user';
import { SignInController } from '../app/users/SignInController';
import { UpdatePasswordController } from '../app/users/UpdatePasswordController';
import { createKnexDataProvider } from "remult/remult-knex";

import fs from 'fs';
import { loadDataArray, ReadGql } from '../shared/readGqlResult';
import { Edge } from '../shared/gql';

export const api = remultExpress({
    entities: [User],
    controllers: [SignInController, UpdatePasswordController, ReadGql],
    getUser: request => request.session!['user'],
    dataProvider: createKnexDataProvider({
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
                instanceName: process.env['SQL_INSTANCE']!,
            }
        },
    }, true),
    initApi: async () => {
        return;

        let result: Edge[] = [];
        for (const what of ['node.js']){//'javascript', 'angular', 'node', 'react', 'vue']) {
            let data: Edge[] = JSON.parse(fs.readFileSync(`./tmp/${what}.json`).toString());
            result.push(...data.filter(x => x.node.id === "1603209"));
            await loadDataArray(what, data);
        }
        fs.writeFileSync('./tmp/tm.json', JSON.stringify(result, undefined, 2))
        //  await readGqlResult(JSON.parse(fs.readFileSync('./tmp/result.json').toString()), "react");
    }
});
