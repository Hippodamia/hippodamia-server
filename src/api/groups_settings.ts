// routes.ts
import { FastifyInstance } from 'fastify';
import {GroupSetting} from "../types";
import * as fs from "fs";

const filePath =  'config/groups_settings.json';

const readGroupsSettings =  (): { [key: string]: GroupSetting } => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading groupsSettings.json:', error);
        return {};
    }
};
const writeGroupsSettings = (data: { [key: string]: any }): void => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing groupsSettings.json:', error);
    }
};
const routes = async (fastify: FastifyInstance) => {
    // GET请求，返回群组ID列表
    fastify.get('/groups', async (request, reply) => {
        const groupsSettings = readGroupsSettings()
        const groupIds = Object.keys(groupsSettings);
        return { success:true,groupIds }
    });

    // GET请求，返回指定ID的群组配置
    fastify.get<{ Params: { id: string } }>('/groups/:id', async (request, reply) => {
        const groupsSettings = readGroupsSettings()
        const groupId = request.params.id;
        const groupConfig = groupsSettings[groupId];

        if (groupConfig) {
            return { success:true,groupId, groupConfig }
        } else {
            reply.code(404).send({ success:false ,error: 'Group not found' });
        }
    });

    // POST请求，添加群组及其配置
    fastify.post<{ Body:  GroupSetting,Params: { id: string } }>('/groups/:id', async (request, reply) => {
        let groupsSettings = readGroupsSettings()

        const groupId = request.params.id;
        const groupConfig = request.body;

        if (!groupId || !groupConfig) {
            reply.code(400).send({ error: 'Invalid request body' });
            return;
        }

        if(groupsSettings[groupId]) {
            reply.code(400).send({ error: 'Group already exists' });
            return;
        }

        groupsSettings[groupId] = groupConfig;

        writeGroupsSettings(groupsSettings)
        return { success: true };
    });

    // PUSH请求，合并现有配置
    fastify.put<{ Body:  GroupSetting,Params: { id: string } }>('/groups/:id', async (request, reply) => {
        let groupsSettings = readGroupsSettings()


        const groupId = request.params.id;
        const groupConfig = request.body;

        if (!groupId || !groupConfig) {
            reply.code(400).send({ error: 'Invalid request body' });
            return;
        }

        if (!groupsSettings[groupId]) {
            reply.code(404).send({ error: 'Group not found' });
            return;
        }

        // 合并配置
        groupsSettings[groupId] = { ...groupsSettings[groupId], ...groupConfig };
        writeGroupsSettings(groupsSettings)
        return { success: true };

    });

    // DELETE请求，删除指定ID的群组配置
    fastify.delete<{ Params: { id: string } }>('/groups/:id', async (request, reply) => {
        let groupsSettings = readGroupsSettings()

        const groupId = request.params.id;

        if (!groupId || !groupsSettings[groupId]) {
            reply.code(404).send({ error: 'Group not found' });
            return;
        }

        delete groupsSettings[groupId];
        writeGroupsSettings(groupsSettings)
        return { success: true };
    });
};

export default routes;
