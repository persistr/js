module.exports = async function(http, { identity, space, domain, spec }) {
  await http.put({ identity, endpoint: `/spaces/${space}/domains/${domain}/model`, 
    headers: { 'content-type': 'text/domainmodel; charset=UTF-8' },
    body: spec
  })
}
