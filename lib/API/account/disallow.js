module.exports = async function(http, { identity, space, role, email }) {
  return await http.post({ identity, endpoint: `/spaces/${space}/disallow`, body: { role, email }})
}