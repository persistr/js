module.exports = async function(http, { identity, db, email }) {
  return await http.post({ identity, endpoint: `/db/${db}/revoke`, query: { email }})
}
