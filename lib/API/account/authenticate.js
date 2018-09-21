module.exports = async function(http, { apikey, email, password }) {
  if (email && password) return await http.post({ endpoint: '/auth', body: { email, password }})
  if (apikey) return await http.post({ endpoint: '/auth', headers: { authorization: `Apikey ${apikey}` }})
}
