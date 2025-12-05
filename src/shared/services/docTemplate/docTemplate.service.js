import api from '@/api'
import store from '@/store'
const BASE_PATH = '/doc_templates'
import { EventObserver } from '@/modules/common/helpers/EventObserver.class'

class DocTemplateService {
  constructor() {
    this._templatesMap = new Map()
    this.eo = new EventObserver()
  }

  async getAllowedTemplates({ client, type, agreement }) {
    if (!client || !type) throw new Error('DocTemplateService:getAllowedTemplates: missing required params!')
    const cacheKey = client + type + agreement
    if (this._templatesMap.has(cacheKey)) return this._templatesMap.get(cacheKey)

    if (this.eo.pending(cacheKey)) {
      const promise = new Promise(resolve => {
        this.eo.subscribe(cacheKey, data => {
          resolve(data)
        })
      })
      return await promise
    } else {
      this.eo.add(cacheKey)
      const { data } = await api.get(BASE_PATH, {
        params: {
          company: store.getters.directoriesProfile,
          client,
          type,
          agreement,
        },
      })
      this._templatesMap.set(cacheKey, data)
      this.eo.broadcast(cacheKey, data)
      return data
    }
  }
}

export default new DocTemplateService()
