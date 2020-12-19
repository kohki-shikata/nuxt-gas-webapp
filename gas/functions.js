function getFtUserList() {
  // FTユーザー一覧を取得
  const getFtUserListEndpoint = baseUrl + 'api/v2/teams/' + ftTeamId + '?apiKey=' + apikey

  const options = {
    method: 'get'
  }

  const users = JSON.parse(UrlFetchApp.fetch(getFtUserListEndpoint, options)).members

  let userDatas = []
  for(const item of userDatas) {
    userDatas.push({
      id: item.id,
      name: item.name
    })
  }
  return users
}

function getProjectKeyList() {
  const endpoint = baseUrl + 'api/v2/projects?&apiKey=' + apikey

  const options = {
    method: 'get'
  }

  const projects = JSON.parse(UrlFetchApp.fetch(endpoint, options))

  return _.map(projects, 'projectKey')
}

function getPresetTasksMovie() {
  return preDefinedTasksMovie
}


function addProject(name, key) {
  const payload = {
    name: name,
    key: key,
    chartEnabled: true,
    projectLeaderCanEditProjectLeader: true,
    subtaskingEnabled: true,
    textFormattingRule: 'markdown'
  }
  const options = {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: payload,
    muteHttpExceptions: true
  }
  const url = baseUrl + 'api/v2/projects?apiKey=' + apikey
  const response = UrlFetchApp.fetch(url, options)
  return response
}


function addTeam(id) {
  const url = baseUrl + 'api/v2/projects/' + id + '/teams?apiKey=' + apikey
  const payload = {
    teamId: ftTeamId.toFixed()
  }
  const options = {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: payload,
    muteHttpExceptions: true
  }
  const response = UrlFetchApp.fetch(url, options)
  return response
}

function addTasks(array) {
  const url = baseUrl + 'api/v2/issues?apiKey=' + apikey
  let responses = []
  for(const item of array) {
    const options = {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      payload: item,
      muteHttepExceptions: true
    }
    const response = UrlFetchApp.fetch(url, options)
    responses.push(response)
  }
  return responses
}

function addShikata(pid) {
  const url = baseUrl + 'api/v2/projects/' + pid + '/users?apiKey=' + apikey
  const options = {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: {
      userId: shikataId.toFixed()
    },
    muteHttepExceptions: true
  }
  const response = UrlFetchApp.fetch(url, options)
  return response
}


function listUpTypes(projectId) {
  const url = baseUrl + 'api/v2/projects/' +projectId + '/issueTypes?apiKey=' + apikey

  const options = {
    method: 'get',
    muteHttpExceptions: true
  }

  const response = UrlFetchApp.fetch(url, options)
  return response
}


function main() {
  const resProject = addProject()
  Logger.log(resProject)
  // const resAddTeam = addTeam(JSON.parse(resProject).id.toFixed())
  // Logger.log(resAddTeam)
}
