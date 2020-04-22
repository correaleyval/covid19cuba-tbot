import { ContextMessageUpdate } from 'telegraf'
import axios, { AxiosResponse } from 'axios'
import summary from '../types/summary'

import UserModel from '../models/User'
import ChatModel from '../models/Chats'

export default async (ctx: ContextMessageUpdate) => {
    let chatId = ctx.message?.chat.id
    let userId = ctx.from?.id

    ctx.telegram.sendChatAction(chatId || 0, 'typing')

    try {
        if (ctx.from) {
            let user = await UserModel.findOneAndUpdate({id: userId}, ctx.from)

            if (!user) await UserModel.create(ctx.from)
        }

        let chat = await ctx.getChat()

        let ch = await ChatModel.findOneAndUpdate({id: chat.id}, chat)

        if(!ch) ChatModel.create(chat)

    }
    catch (err) {
        console.error(err)
    }

    let res: AxiosResponse<summary> = 
        await axios.get(process.env.API_URI + 'summary')

    ctx.replyWithHTML(`
🤒 <b>Diagnosticados</b>: ${res.data.total_diagnosticados}
🔬 <b>Diagnosticados hoy</b>: ${res.data.diagnosticados_hoy}
🤧 <b>Activos</b>: ${res.data.activos}
😃 <b>Recuperados</b>: ${res.data.total_recuperados}
🤩 <b>Índice de Recuperación</b>: ${res.data.recuperacion}%
✈️ <b>Evacuados</b>: ${res.data.total_evacuados}
⚰️ <b>Fallecidos</b>: ${res.data.total_fallecidos}
😵 <b>Mortalidad</b>: ${res.data.mortalidad}%
🏥 <b>Ingresados</b>: ${res.data.total_ingresados}
📆 <b>Actualizado</b>: ${res.data.fecha}
`)

    ctx.telegram.sendChatAction(chatId || 0, 'typing')

    let graph = await axios.get(`${process.env.API_URI}summary_graph`, {responseType: 'arraybuffer'})

    ctx.replyWithPhoto({source: Buffer.from(graph.data)})
}