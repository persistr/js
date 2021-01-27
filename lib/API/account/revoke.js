module.exports = async function(http, { identity, db, role, email }) {
  return await http.post({ identity, endpoint: `/db/${db}/revoke`, query: { role, email }})
}
