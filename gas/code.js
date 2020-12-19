// function doGet (request) {
//   const htmlOutput = HtmlService.createTemplateFromFile('index').evaluate()
//   htmlOutput
//     .addMetaTag('viewport', 'width=device-width, initial-scale=1')
//     .setTItle('FirstTone Project Igniter')

//   return htmlOutput
// }

function include (filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent()
}

const apikey = PropertiesService.getScriptProperties().getProperty("backlogapi")
const baseUrl = PropertiesService.getScriptProperties().getProperty('baseUrl')
const ftTeamId = 60014
const shikataId = 319302
const _ = LodashGS.load()

function doGet(e) {
  const toppage = HtmlService.createTemplateFromFile("index").evaluate()

  toppage
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('FirstTone Project Igniter')
  return toppage
}

function doPost(e){
  // フォームに入力されたプロジェクト名とプロジェクトキーの取得
  const name = e.parameter.projectName
  const key = e.parameter.projectKey

  // プロジェクトの追加
  const resProject = addProject(name,key)

  // 作成されたプロジェクトのID
  const pid = JSON.parse(resProject).id

  // 追加したプロジェクトに初期設定されている種別の一覧取得
  const resLists = listUpTypes(pid)

  // 取得した種別一覧から、種別IDを配列で取得
  const typeIds = _.map(JSON.parse(resLists), 'id')

  // 適当なIDを取得したいため、配列の１番目だけ抜き出し
  const appropriateId = typeIds[0]

  // 課題データ抽出
  const params = e.parameter
  const tasksObj = _.pickBy(params, (value, key) => {return key.match(/^task-summary-/)})

  // 課題データをオブジェクトから配列に
  const tasksArray = Object.entries(tasksObj).map(([key, value]) => ({[key]: value}))

  // 課題データのkey接頭辞を削除
  const tasksArrayRemovedPrefix = stripPrefix(tasksArray, 'task-summary-')

  // 課題データをkey名で連番ソート
  const tasksSorted = getSortedKeys(tasksArrayRemovedPrefix)

  // 課題データを配列に
  let tasksSortedArray = []
  for(let item of tasksSorted) {
    tasksSortedArray.push(Object.values(item))
  }
  tasksSortedArray = _.flattenDeep(tasksSortedArray)

  // 課題に紐づいたユーザーIDを抽出
  const userIdsObj = _.pickBy(params, (value, key) => { return key.match(/^task-user-/)})

  // ユーザーIDをオブジェクトから配列に
  const userIdsArray = Object.entries(userIdsObj).map(([key, value]) => ({[key]: value}))

  // ユーザーIDのkey接頭辞を削除
  const userIdsArrayRemovedPrefix = stripPrefix(userIdsArray, 'task-user-')

  // ユーザーIDのkey名で連番ソート
  const userIdsSorted = getSortedKeys(userIdsArrayRemovedPrefix)

  // ユーザーIDを配列に
  let userIdsSortedArray = []
  for(let item of userIdsSorted) {
    userIdsSortedArray.push(Object.values(item))
  }
  userIdsSortedArray = _.flattenDeep(userIdsSortedArray)

  // 【デバッグ】ユーザー四方を追加
  addShikata(pid)

  // 課題とユーザーIDの配列をマージし、プロジェクトIDと種別IDを付加
  let combinedTasksData = []
  for(let i = 0; i < tasksSortedArray.length; i++) {
    combinedTasksData.push({
      summary: tasksSortedArray[i],
      assigneeId: userIdsSortedArray[i],
      projectId: pid.toFixed(),
      issueTypeId: appropriateId.toFixed(),
      priorityId: (3).toFixed()
    })
  }

  const response = addTasks(combinedTasksData)
  return ContentService.createTextOutput(JSON.stringify(response));
}
