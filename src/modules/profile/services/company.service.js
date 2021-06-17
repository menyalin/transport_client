import api from '@/api'

class CompanyService {
  getMyCompanies() {
    return new Promise((resolve, reject) => {
      api
        .get('/companies')
        .then(({ data }) => {
          resolve(data?.data)
        })
        .catch((e) => reject(e))
    })
  }

  async create() {
    return null
  }
}

export default new CompanyService()
