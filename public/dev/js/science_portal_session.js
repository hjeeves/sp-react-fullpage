;(function($) {
  // register namespace
  $.extend(true, window, {
    cadc: {
      web: {
        science: {
          portal: {
            session: {
              PortalSession: PortalSession,
              // Events
              events: {
                onLoadSessionListDone: new jQuery.Event('sciPort:onLoadSessionListDone'),
                onLoadSessionListError: new jQuery.Event('sciPort:onLoadSessionListError'),
                onSessionDeleteOK: new jQuery.Event('sciPort:onSessionDeleteOK'),
                onSessionDeleteError: new jQuery.Event('sciPort:onSessionDeleteError'),
                onPollingContinue: new jQuery.Event('sciPort:onPollingContinue'),
              }
            }
          }
        }
      }
    }
  })


  /**
   * Class for handling Skaha session interaction and data
   * @constructor
   */
  function PortalSession() {
    var _selfPortalSess = this
    var _isEmpty = true
    this._sessionList = {}
    this._sessionTypeList = []

    function setServiceURLs(URLObject) {
      _selfPortalSess.sessionServiceURL = URLObject.session
    }

    function initSessionLists() {
      _isEmpty = true
      _selfPortalSess._sessionList = {}
      _selfPortalSess._filteredSessionList = {}
    }

    function getSessionList() {
      if (_selfPortalSess._sessionList === {}) {
        initSessionLists()
      }
      return _selfPortalSess._sessionList
    }

    function setSessionTypeList(thelist) {
      _selfPortalSess._sessionTypeList = thelist
    }

    var statusDisplayPriority = {
      "running" : 1,
      "pending" : 2,
      "terminating" : 3,
      "succeeded" : 4,
      "failed" : 5,
      "unknown": 6
    }

    var typeDisplayPriority = {
      "notebook" : 1,
      "desktop" : 2,
      "carta" : 3,
      "contributed" : 4,
      'headless' : 5
    }

    function sortSessions(sList) {
      sList.forEach((e) => {
        console.log(`${e.type} ${e.status} ${e.name}`);
      });


      sList.sort((a, b) => {
        // Sort order: type, status, name

        // rough sort by type first
        let typeA = a.type.toLowerCase()
        let typeOrderA = typeDisplayPriority[typeA]
        let typeB = b.type.toLowerCase()
        let typeOrderB = typeDisplayPriority[typeB]

        if (typeOrderA < typeOrderB) {
          return -1
        }
        if (typeOrderA > typeOrderB) {
          return 1
        }

        if (typeOrderA === typeOrderB) {

          let statusA = a.status.toLowerCase()
          let orderA = statusDisplayPriority[statusA]
          let statusB = b.status.toLowerCase()
          let orderB = statusDisplayPriority[statusB]

          if (orderA < orderB) {
            return -1
          }

          if (orderA > orderB) {
            return 1
          }

          if (orderA === orderB) {

            let nameA = a.name.toLowerCase()
            let nameB = b.name.toLowerCase()


            if (nameA < nameB) {
              return -1
            }

            if (nameA > nameB) {
              return 1
            }

            return 0
          }
        }

      })

      sList.forEach((e) => {
        console.log(`${e.type} ${e.status} ${e.name}`);
      });

      return sList
    }


    function getSessionByID(sessionID) {
      var session = null
      for (var i = 0; i < _selfPortalSess._sessionList.length; i++) {
        if (_selfPortalSess._sessionList[i].id == sessionID) {
          session = _selfPortalSess._sessionList[i]
        }
      }
      return session
    }

    function getSessionByNameType(sessionData) {
      var session = null
      for (var i = 0; i < _selfPortalSess._sessionList.length; i++) {
        if ((_selfPortalSess._sessionList[i].name == sessionData.name) &&
        (_selfPortalSess._sessionList[i].type == sessionData.type) ) {
          session = _selfPortalSess._sessionList[i]
        }
      }
      return session
    }



    /**
     * Check if session for sessionID is of the given status
     * @param sessionID
     * @param sessionStatus
     * @returns {boolean}
     */
    function isSessionStatusByID(sessionID, sessionStatus) {
      var isStatus = false
      if (sessionID != {}) {
        var session = _selfPortalSess.getSessionByID(sessionID)
        if (session != null) {
          if (session.status == sessionStatus){
            isStatus = true
          }
        }
      }
      return isStatus
    }


    function isRunningSession(session) {
      return isSessionStatus(session, 'Running')
    }


    function getFilteredSessionList() {
      _selfPortalSess._filteredSessionList = new Array()

      var tmpList = new Array()

      for (var i=0; i<_selfPortalSess._sessionList.length; i++) {
        var curSes = _selfPortalSess._sessionList[i]

        const isInList = (element) => element === curSes.type
        var typeIndex = _selfPortalSess._sessionTypeList.findIndex(isInList)

        if (typeIndex !== -1) {
          if ( curSes.status === 'Running' || curSes.status === 'Pending') {
            tmpList.push(curSes)
          }
        }
      }
      _selfPortalSess._filteredSessionList = tmpList

      return tmpList
    }


    function isAllSessionsStable() {
      var allStable = true

      for (var i = 0; i < _selfPortalSess._sessionList.length; i++) {
        // Only Pending state will trigger a poll
        if (_selfPortalSess._sessionList[i].status === 'Pending') {
          allStable = false
          break
        }
      }
      return allStable
    }


    function isSessionStatus(session, sessionStatus) {
      return session.status === sessionStatus
    }

    /**
     * Build a default session name based on the session type and current count
     * of sessions
     * @param sessionType
     * @returns {*}
     */
    function getDefaultSessionName(sessionType) {
      // First entry will have a '1'
      var count = 1
      for (var i = 0; i < _selfPortalSess._sessionList.length; i++) {
        if (_selfPortalSess._sessionList[i].type === sessionType) {
          count++
        }
      }
      return sessionType + count
    }

    function setSessionList(sessionList) {
      if (sessionList.length > 0) {
        _selfPortalSess._sessionList = sessionList
        _selfPortalSess._isEmpty = false
      } else {
        _selfPortalSess._sessionList = {}
        _selfPortalSess._isEmpty = true
      }
    }


    function isSessionListEmpty() {
      return _selfPortalSess._isEmpty
    }

    /**
     * Run this on page load to see if there's something to start up.
    */
    function loadSessionList() {
      Promise.resolve(getSessionListAjax(_selfPortalSess.sessionServiceURL, {}))
        .then(function(sessionList) {

          setSessionList(sessionList)
          trigger(_selfPortalSess, cadc.web.science.portal.session.events.onLoadSessionListDone)

        })
        .catch(function(message) {
          // get session list failed in a way that can't allow page to continue
          trigger(_selfPortalSess, cadc.web.science.portal.session.events.onLoadSessionListError, message)
        })
    }

    function getSessionListAjax(serviceURL, sessionData) {

      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest()

        // 'load' is the XMLHttpRequest 'finished' event
        request.addEventListener(
          'load',
          function () {
            if (request.status === 200) {
              var jsonData = JSON.parse(request.responseText)
              resolve(jsonData)
            } else {
              reject(request)
            }
          },
          false
        )
        // withCredentials enables cookies to be sent
        // Note: SameSite cookie header isn't set with this method,
        // may cause problems with Chrome and other browsers? Feb 2021
        request.withCredentials = true
        request.open('GET', serviceURL)
        request.send(null)
      })
    }

    function deleteSession(sessionID) {
      Promise.resolve(deleteSessionAjax(_selfPortalSess.sessionServiceURL + "/" + sessionID, sessionID))
        .then(function(sessionID) {
          trigger(_selfPortalSess, cadc.web.science.portal.session.events.onSessionDeleteOK, sessionID)
        })
        .catch(function(message) {
          // get session list failed in a way that can't allow page to continue
          trigger(_selfPortalSess, cadc.web.science.portal.session.events.onSessionDeleteError, message)
        })
    }

    function deleteSessionAjax(serviceURL, sessionID) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest()

        // 'load' is the XMLHttpRequest 'finished' event
        request.addEventListener(
          'load',
          function () {
            if (request.status === 200) {
              resolve(sessionID)
            } else {
              reject(request)
            }
          },
          false
        )
        // withCredentials enables cookies to be sent
        // Note: SameSite cookie header isn't set with this method,
        // may cause problems with Chrome and other browsers? Feb 2021
        request.withCredentials = true
        request.open('DELETE', serviceURL)
        request.send(null)
      })
    }

    function pollSessionList(interval) {
        // TODO: consider long-running timeout so panel left in background doesn't use
        // resources forever
        interval = interval || 200

        var checkCondition = function (resolve, reject) {
          getSessionListAjax(_selfPortalSess.sessionServiceURL)
            .then(function (sessionList) {
              _selfPortalSess.setSessionList(sessionList)
              if (_selfPortalSess.isAllSessionsStable()) {
                resolve("done")
              } else {
                // If neither of the conditions are met and the timeout
                // hasn't elapsed, go again
                // update info modal with current status?
                trigger(_selfPortalSess, cadc.web.science.portal.session.events.onPollingContinue)
                setTimeout(checkCondition, interval, resolve, reject)
              }
            })
            .catch(function (message) {
              reject(new Error('Error polling session list. Reload page to try again or contact CANFAR admin for assistance.'))
            })
        } // end checkCondition
        return new Promise(checkCondition)
    }

    // ---------- Event Handling Functions ----------

    function subscribe(target, event, eHandler) {
      $(target).on(event.type, eHandler)
    }

    function unsubscribe(target, event) {
      $(target).unbind(event.type)
    }

    function trigger(target, event, eventData) {
      $(target).trigger(event, eventData)
    }


    initSessionLists()

      $.extend(this, {
        setServiceURLs: setServiceURLs,
        initSessionLists: initSessionLists,
        getDefaultSessionName: getDefaultSessionName,
        getSessionByID: getSessionByID,
        getSessionByNameType: getSessionByNameType,
        getSessionList: getSessionList,
        getFilteredSessionList: getFilteredSessionList,
        loadSessionList: loadSessionList,
        setSessionList: setSessionList,
        setSessionTypeList: setSessionTypeList,
        isAllSessionsStable: isAllSessionsStable,
        isSessionStatus: isSessionStatus,
        isRunningSession: isRunningSession,
        isSessionStatusByID: isSessionStatusByID,
        isSessionListEmpty : isSessionListEmpty,
        pollSessionList: pollSessionList,
        deleteSession: deleteSession,
        sortSessions: sortSessions
      })
    }

})(jQuery)
