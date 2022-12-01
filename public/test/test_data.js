const testSessionList = [
  {
    "id": "pf6w8kup",
    "userid": "jeevesh",
    "image": "images.canfar.net/canucs/canucs:1.2.5",
    "type": "notebook",
    "status": "Pending",
    "name": "notebook22",
    "startTime": "2022-11-29T16:06:43Z",
    "connectURL": "https://ws-uv.canfar.net/session/notebook/pf6w8kup/lab/tree/arc/home/jeevesh?token=pf6w8kup",
    "requestedRAM": "1G",
    "requestedCPUCores": "1",
    "requestedGPUCores": "<none>",
    "coresInUse": "2m",
    "ramInUse": "90Mi"
  },
  {
    "id": "x0ef9clu",
    "userid": "jeevesh",
    "image": "images.canfar.net/skaha/desktop:1.0.2",
    "type": "desktop",
    "status": "Running",
    "name": "desktop1",
    "startTime": "2022-11-29T16:08:37Z",
    "connectURL": "https://ws-uv.canfar.net/session/desktop/x0ef9clu/?password=x0ef9clu&path=session/desktop/x0ef9clu/",
    "requestedRAM": "16G",
    "requestedCPUCores": "2",
    "requestedGPUCores": "<none>",
    "coresInUse": "561m",
    "ramInUse": "8Mi"
  },
  {
    "id": "pf6w8kup",
    "userid": "jeevesh",
    "image": "images.canfar.net/canucs/canucs:1.2.5",
    "type": "notebook",
    "status": "Running",
    "name": "notebook2",
    "startTime": "2022-11-29T16:06:43Z",
    "connectURL": "https://ws-uv.canfar.net/session/notebook/pf6w8kup/lab/tree/arc/home/jeevesh?token=pf6w8kup",
    "requestedRAM": "1G",
    "requestedCPUCores": "1",
    "requestedGPUCores": "<none>",
    "coresInUse": "2m",
    "ramInUse": "90Mi"
  },
  {
    "id": "pf6w8kup",
    "userid": "jeevesh",
    "image": "images.canfar.net/canucs/canucs:1.2.5",
    "type": "notebook",
    "status": "Pending",
    "name": "notebook2",
    "startTime": "2022-11-29T16:06:43Z",
    "connectURL": "https://ws-uv.canfar.net/session/notebook/pf6w8kup/lab/tree/arc/home/jeevesh?token=pf6w8kup",
    "requestedRAM": "1G",
    "requestedCPUCores": "1",
    "requestedGPUCores": "<none>",
    "coresInUse": "2m",
    "ramInUse": "90Mi"
  }
]

const SESSION_DISPLAY_DATA = [
  {
    "name": "TEST notebook2",
    "id": "abcd1234",
    "image": "images-rc.canfar.net/alinga/jupyter:canucs.v1.2.2",
    "status": "Running",
    "type": "notebook",
    "RAM": "2G",
    "cores": "2 cores",
    "logo": "https://www.canfar.net/science-portal/images/jupyterLogo.jpg",
    "altText": "jupyter lab",
    "deleteHandler": handleDeleteSession,
    "connectHandler": handleConnectRequest,
    "startTime" : '2022-11-22T20:11:30Z'
  },
  {
    "name": "TEST carta",
    "id": "abcd1234",
    "image": "images-rc.canfar.net/skaha/carta:3.0",
    "status": "Pending",
    "type": "carta",
    "RAM": "2G",
    "cores": "2 cores",
    "logo": "https://www.canfar.net/science-portal/images/cartaLogo.png",
    "altText": "carta",
    "deleteHandler": handleDeleteSession,
    "connectHandler": handleConnectRequest,
    "startTime" : '2022-11-22T20:49:56Z'
  },
  {
    "name": "TEST notebook1",
    "id": "abcd1234",
    "image": "images-rc.canfar.net/alinga/jupyter:canucs.v1.2.2",
    "status": "Running",
    "type": "notebook",
    "RAM": "2G",
    "cores": "2 cores",
    "logo": "https://www.canfar.net/science-portal/images/jupyterLogo.jpg",
    "altText": "jupyter lab",
    "deleteHandler": handleDeleteSession,
    "connectHandler": handleConnectRequest,
    "startTime" : '2022-11-22T20:11:30Z'
  },
  {
    "name": "TEST headless",
    "id": "abcd1234",
    "image": "images-rc.canfar.net/skaha/carta:3.0",
    "status": "Running",
    "type": "headless",
    "RAM": "2G",
    "cores": "2 cores",
    "logo": "https://www.canfar.net/science-portal/images/fas_cube.png",
    "altText": "carta",
    "deleteHandler": handleDeleteSession,
    "connectHandler": handleConnectRequest,
    "startTime" : '2022-11-22T20:49:56Z'
  }
]


// Test functions that simulate data calls without making the ajax calls
// Use existing functions to get data from forms, etc., and construct the new
// lists
function handleDeleteSession(e) {
  // return session list object with that one removed
}

function handleConnectRequest(e) {
  // return new session list with the form data just selected? (that'd be complicated?)
}

function handleResetSessionList () {
  // change something about the display data
  // feed through sort function (to be written)
  // include headless (for this testing)
  //
  var a=1
}


// Test functions
function testSessionListSort(theList) {
  var sortedDisplayList = launch_js.sortSessionList(theList)
  window.SciencePortalApp.updateSessionList(sortedDisplayList)
}

function testAjaxFailState(message) {

}

function testModal(message) {
  launch_js.portalCore.hideModal(window.SciencePortalApp)
  launch_js.portalCore.setModal(window.SciencePortalApp, 'Modal Test 1', 'Test data for modal showing spinner', true, true, true)
}

const testSessionURLs = {
          'base': "https://rc-uv.canfar.net",
          'session': 'https://rc-uv.canfar.net/skaha/session',
          'context': 'https://rc-uv.canfar.net/skaha/context',
          'images': 'https://rc-uv.canfar.net/skaha/image',
          'authBaseURL': "https://www.canfar.net/"
        }

