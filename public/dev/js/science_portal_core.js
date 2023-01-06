;(function($) {
  // register namespace
  $.extend(true, window, {
    cadc: {
      web: {
        science: {
          portal: {
            core: {
              PortalCore: PortalCore,
              // Events
              events: {
                onAuthenticated: new jQuery.Event('sciPort:onAuthenticated'),
                onServiceURLOK: new jQuery.Event('sciPort:onServiceURLOK'),
                onServiceURLFail: new jQuery.Event('sciPort:onServiceURLFail')
              },
              headerURI: {
                search: "ivo://cadc.nrc.ca/search",
                gmui: "ivo://cadc.nrc.ca/groups"
              }
            }
          }
        }
      }
    }
  })

  /**
   * Common functions to support Science Portal UI.
   *
   * @constructor
   * @param {{}} inputs   Input configuration.
   * @param {String} [inputs.baseURL='https://www.canfar.net/'] URL of the /reg web service
   * needed by the Registry to look up web service and ui URLs for use in ajax calls by this page.
   */
  function PortalCore(inputs) {

    var _selfPortalCore = this
    var baseURL =
            inputs && inputs.hasOwnProperty('baseURL')
                ? inputs.baseURL
                : 'https://www.canfar.net'

    var _registryClient
    var _headerURLCallCount = 0

    if (typeof inputs.registryLocation !== "undefined") {
      _registryClient= new Registry({
        baseURL: inputs.registryLocation
      })
    } else {
      _registryClient = new Registry({
        baseURL: baseURL
      })
    }

    var redirectUtil = new ca.nrc.cadc.RedirectUtil()

    var _rApp = inputs.reactApp
    var _isAuthenticated = false

    var _ajaxCallCount = 0

    var _sessionServiceResourceID = inputs.sessionsResourceID

    function init(overrideURLs) {
      setSessionServiceURLs(overrideURLs)
    }

    // Primarily used for testing
    function setReactAppRef(reactApp) {
      _selfPortalCore._rApp = reactApp
    }

    // ------------ Page state management functions ------------

    function setModal(modalLink, title, msg, showSpinner, showReload, showHome) {
      var modaldata = {
        'msg': msg,
        'title': title,
        'isOpen': true,
        'showSpinner': showSpinner,
        'showReload': showReload,
        'showHome' : showHome
      }
      _rApp.updateModal(modaldata)
    }

    function hideModal(modalLink) {
      var modaldata = {
        'msg': "",
        'title': "",
        'isOpen': false,
        'showSpinner': false,
        'showReload': false,
        'showHome' : false
      }
      _rApp.updateModal(modaldata)
    }

    function setConfirmModal(modalLink, confirmFn, confirmData) {
      var deleteMsg = "Session name " + confirmData.name + ", id " + confirmData.id

      var modaldata = {
        handlers: {
          'onConfirm': confirmFn,
          'onClose': hideConfirmModal
        },
        dynamicProps: {
          'msg': deleteMsg,
          'isOpen': true,
          'confirmData': confirmData
        }
      }
      _rApp.openConfirmModal(modaldata)
    }

    function initConfirmModal(modalLink, confirmFn, cancelFn) {
      var modaldata = {
        handlers: {
          'onConfirm': confirmFn,
          'onClose': hideConfirmModal
        },
        dynamicProps: {
          'msg': '',
          'isOpen': false,
          'confirmData': {}
        }
      }
      _rApp.setConfirmModal(modaldata)
    }

    function hideConfirmModal(modalLink) {
      var
        modalData =  {
        dynamicProps:  {
            'msg': '',
            'buttonText': 'Delete',
            'confirmData': {}
          }
        }
      _rApp.closeConfirmModal(modalData)
    }

    function showLoginModal() {
      _rApp.openLoginModal(true)
    }

    function hideLoginModal() {
      _rApp.openLoginodal(false)
    }

    function clearAjaxAlert(reactAppLink) {
      setPageState("success", false, reactAppLink)
    }

    function setProgressBar(state) {
      var a = "TODO"
    }

    // Communicate AJAX progress and status using progress bar
    function setPageState(barType, isAnimated, reactAppLink, alertMsg) {
      var pageState = {
        "progressBar": {
          "type": barType,
          "animated": isAnimated
        },
        "isAuthenticated" : _isAuthenticated
      }

      if (typeof alertMsg !== 'undefined') {
        pageState.alert = {
                        'type': barType,
                        'show':  true,
                        'message': alertMsg
                      }
      } else {
        pageState.alert = {
          "show": false
        }
      }
      reactAppLink.setPageStatus(pageState)
    }

    function setAjaxFail(message, reactAppLink) {
      var alertMsg = message.status + ": " + getRcDisplayText(message)
      setPageState('danger', false, reactAppLink, alertMsg)
      hideModal(reactAppLink)
    }

    function setAjaxSuccess(message, reactAppLink) {
      setPageState("success", false, reactAppLink, message)
    }

    function handleAjaxError(request, reactAppLink) {
      hideModal(reactAppLink)
      setAjaxFail(request, reactAppLink)
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


    // ------------ HTTP/Ajax functions ------------

    function getSessionServiceEndpoint() {
      return _registryClient
          .getServiceURL(
            _sessionServiceResourceID,
              'vos://cadc.nrc.ca~vospace/CADC/std/Proc#sessions-1.0',
              'vs:ParamHTTP',
              'cookie'
          )
    }

    // ------ Set up web service URLs ------

    function setSessionServiceURLs(URLs) {
      if (typeof URLs !== "undefined") {
        _selfPortalCore.sessionServiceURLs = URLs
        trigger(_selfPortalCore, cadc.web.science.portal.core.events.onServiceURLOK)
      } else {
        //setInfoModal('Loading Page Resources', 'Locating session web service.', false, true, true)
        setModal(_rApp, 'Loading Page Resources', 'Locating session web service.', true, false, false)
        Promise.resolve(getSessionServiceEndpoint())
          .then(function (serviceURL) {
              if (typeof serviceURL != 'undefined') {

                _selfPortalCore.sessionServiceURLs = {
                  'base': serviceURL,
                  'session': serviceURL + '/session',
                  'context': serviceURL + '/context',
                  'images': serviceURL + '/image'
                }
                _selfPortalCore.hideModal(_rApp)
                trigger(_selfPortalCore, cadc.web.science.portal.core.events.onServiceURLOK)
              } else {
                // Don't hide modal as the page isn't ready to be interacted with yet
                trigger(_selfPortalCore, cadc.web.science.portal.core.events.onServiceURLFail)
              }
            }
          )
          .catch(function (message) {
            trigger(_selfPortalCore, cadc.web.science.portal.core.events.onServiceURLFail)
          })
      }
    }

    function setHeaderURLs() {
        // TODO: this modal likely to go away
        setModal(_rApp, 'Loading Header Resources', 'Locating session web service.', true, false, false)

        const headerURIs = [
          ca.nrc.cadc.accountURI.passchg,
          ca.nrc.cadc.accountURI.passreset,
          ca.nrc.cadc.accountURI.acctrequest,
          ca.nrc.cadc.accountURI.acctupdate,
          cadc.web.science.portal.core.headerURI.gmui,
          cadc.web.science.portal.core.headerURI.search
        ]
        _selfPortalCore.headerURLs = new Object()
        _selfPortalCore.headerURLs.baseURLCanfar = baseURL
        _headerURLCallCount = headerURIs.length

      // Get entire applications registry to process
      _registryClient.getApplicationsEndpoints()
        .then(function (urlRequest) {
          for (var i = 0; i < headerURIs.length; i++) {
            var uri = headerURIs[i]
            let url = _registryClient.extractURL(urlRequest, uri)
            var uriKey = uri.substring(uri.lastIndexOf("\/") + 1, uri.length)
            console.log("uriKey: " + uriKey)
            _selfPortalCore.headerURLs[uriKey] = url
            console.log("finished loop step " + i)
          }
          _rApp.setHeaderURLs(_selfPortalCore.headerURLs)
        })
        .catch(function (err) {
          alert('Error obtaining registry applications list msg: ' + err)
        })

    }

// ------------ Service Status parsing & display functions ------------

    /**
     * Parse return codes and add text for the screen
     * @param request
     * @returns {string}
     */
    function getRcDisplayText(request) {
      var displayText
      switch(request.status) {
        case 403:
          displayText = 'You are not authorised to use Skaha resources. Contact CANFAR admin' +
          ' for information on how to get set up with a resource allocation and permission to access the service.'
          break
        case 400:
          // Do as good a test for max number of sessions reached message from Skaha as possible:
          if (request.responseText.includes('session already running')) {
            displayText = 'Limit of number of sessions of selected type reached'
            break
          }
        default:
          displayText = request.responseText
          break
      }

      return displayText
    }

    /**
     * Parse return codes and add text for the screen
     * @param request
     * @returns {string}
     */
    function getRcDisplayTextPlusCode(request) {
      var displayText
      switch(request.status) {
        case 403:
          displayText = 'You are not authorised to use Skaha resources. Contact CANFAR admin' +
            ' for information on how to get set up with a resource allocation and permission to access the service.'
          break
        default:
          displayText = request.responseText
          break
      }

      return '(' + request.status + ')' + displayText
    }


    // ------------ Authentication functions ------------

    function checkAuthentication(isDev) {

      userManager = new cadc.web.UserManager(_registryClient)

      // From cadc.user.js. Listens for when user logs in
      userManager.subscribe(cadc.web.events.onUserLoad,
          function (event, data) {
            // Check to see if user is logged in or not
            if (typeof(data.error) !== 'undefined') {
              setNotAuthenticated()
            } else {
              setAuthenticated(data.userManager)
            }
          })

      if (isDev === true) {
        userManager.user.fullname = "dev user"
        setAuthenticated()
      } else {
        userManager.loadCurrent()
      }
    }



    // #auth_modal is in /canfar/includes/_application_header.shtml
    function setNotAuthenticated() {
      // hide existing modal
      // TODO: _rApp needs to be passed to sp_core at start then, rather that
      // get passed in via parameters into show/hideModal
      hideModal(_rApp)

      setPageState("success", false, _rApp)

      var authInfo = {
        'isAuthenticated': false,
        'username': 'Not Authorized'
      }
      _rApp.setAuthenticated(authInfo)
    }

    function setAuthenticated(userManager) {
      var userFullname = userManager.user.getFullName()
      var authInfo = {
        'isAuthenticated': true,
        'username': userFullname
      }
      _rApp.setAuthenticated(authInfo)
      trigger(_selfPortalCore, cadc.web.science.portal.core.events.onAuthenticated, {})
    }

    $.extend(this, {
      init: init,
      getSessionServiceEndpoint: getSessionServiceEndpoint,
      setHeaderURLs: setHeaderURLs,
      setSessionServiceURLs: setSessionServiceURLs,
      setAjaxSuccess: setAjaxSuccess,
      setAjaxFail: setAjaxFail,
      handleAjaxError: handleAjaxError,
      setProgressBar: setProgressBar,
      setPageState: setPageState,
      setReactAppRef: setReactAppRef,
      clearAjaxAlert: clearAjaxAlert,
      setConfirmModal: setConfirmModal,
      hideConfirmModal: hideConfirmModal,
      checkAuthentication: checkAuthentication,
      subscribe: subscribe,
      trigger: trigger,
      getRcDisplayText: getRcDisplayText,
      getRcDisplayTextPlusCode: getRcDisplayTextPlusCode,
      setModal: setModal,
      hideModal: hideModal,
      showLoginModal: showLoginModal,
      hideLoginModal: hideLoginModal,
      initConfirmModal: initConfirmModal
    })
  }

})(jQuery)
