import { ContextMessageUpdate, Markup } from 'telegraf'
import axios, { AxiosResponse } from 'axios'
import summary from '../types/summary'

let keyboard = Markup
    .keyboard([
      ['☢️ Resumen'],
      ['⏳ Evolución de casos por días'],
      ['📝 Datos de los Tests realizados'],
      ['🇨🇺 Casos por provincias'],
      ['🚻 Casos por Sexo'],
      ['👶🏻🧔🏽 Distribución por grupos etarios'],
      ['🦠 Modo de Contagio'],
      ['🌏 Casos por Nacionalidad (Cubanos/Extranjeros)'],
      ['🗺 Distribución por nacionalidad'],
      ['ℹ️ Acerca de'], 
    ])
    .oneTime()
    .resize()
    .extra()

export default async (ctx: ContextMessageUpdate) => {
    let res: AxiosResponse<summary> = 
        await axios.get(process.env.API_URI + 'summary')

    let chatId = ctx.message?.chat.id

    ctx.telegram.sendChatAction(chatId || 0, 'typing')

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
`, keyboard)
}