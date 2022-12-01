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

    var _registryClient = new Registry({
      baseURL: baseURL
    })

    var _ajaxCallCount = 0

    var _sessionServiceResourceID = inputs.sessionsResourceID

    // Initialize the context help, kick off
    // loading the content file, and load the popovers
    var _chOptions = {
      contentFile: 'contexthelp_en.json',
      clickClassname: 'sp-tooltip',
      hoverClassname: 'sp-hover-tooltip'
    }
    //var _contextHelp = new cadc.web.CadcContextHelp(_chOptions)
    // Done here because there's an ajax call involved to open the help
    // resource file.
    //_contextHelp.init()

    // Instantiate progress bars
    var _barOpts = {
      progressBarClass : 'sp-progress-bar',
      progressBarDivID : 'sp_progress_bar'
    }
    var _progressBar = new cadc.web.CadcProgressBar(_barOpts)

    // Instantiate List progress bar
    var _listBarOpts = {
      progressBarClass : 'sp-progress-bar',
      progressBarDivID : 'sp_list_progress_bar'
    }

    var _listProgressBar = new cadc.web.CadcProgressBar(_listBarOpts)

    function init(overrideURLs) {
      _progressBar.init()
      _listProgressBar.init()

      setSessionServiceURLs(overrideURLs)
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
      modalLink.updateModal(modaldata)
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
      modalLink.updateModal(modaldata)
    }

    function setConfirmModal(modalLink, confirmFn, confirmData) {
      var deleteMsg = "Session name " + confirmData.name + ", id " + confirmData.id

      var modaldata = {
        'title': 'Are you sure?',
        'msg': deleteMsg,
        'isOpen': true,
        'confirmHandler': confirmFn,
        'buttonText': 'Delete',
        'confirmData': confirmData
      }
      modalLink.openConfirmModal(modaldata)
    }

    function hideConfirmModal(modalLink) {
      modalLink.closeConfirmModal()
    }

    function clearAjaxAlert(reactAppLink) {
      $('.alert-danger').addClass('hidden')
      $('.alert-success').addClass('hidden')
      setProgressBar('okay')
    }

    // Communicate AJAX progress and status using progress bar
    function setProgressBar(state, reactAppLink) {
      _progressBar.setProgressBar(state)
      // TODO: this will need it's own function so it can act separately
      _listProgressBar.setProgressBar(state)
    }

    function setAjaxFail(message, reactAppLink) {
      $('#status_code').text(message.status)
      $('#error_msg').text(getRcDisplayText(message))
      $('.alert-danger').removeClass('hidden')
      setProgressBar('error')
      hideModals()
    }

    function setAjaxSuccess(message, reactAppLink) {
      //$('#alert_msg').text(message)
      //$('.alert-success').removeClass('hidden')
      //setProgressBar('okay')
      //hideModals()
      var alertData = {
        "show": true,
        "type": "success",
        "message": "test message from sp"
      }
      _reactAppLink.setAjaxAlert(alertData)
    }

    function handleAjaxError(request, reactAppLink) {
      hideInfoModal(true)
      setProgressBar('error')
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

    function prepareRegistry() {
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
        setInfoModal('Loading Page Resources', 'Locating session web service.', false, true, true)
        Promise.resolve(prepareRegistry())
          .then(function (serviceURL) {
              if (typeof serviceURL != 'undefined') {

                _selfPortalCore.sessionServiceURLs = {
                  'base': serviceURL,
                  'session': serviceURL + '/session',
                  'context': serviceURL + '/context',
                  'images': serviceURL + '/image'
                }
                _selfPortalCore.hideInfoModal()
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

    // ------------ Rendering & display functions ------------

    //function setConfirmModal(msgBody, sessionData) {
    //  // Set titles and messages
    //  $('#delete_modal_p').html(msgBody)
    //
    //  // Open modal if not already open
    //  if ($('#delete_modal').data('bs.modal') === undefined ||
    //    $('#delete_modal').data('bs.modal').isShown === false) {
    //
    //    $('#delete_session_button').attr('data-id', sessionData.id)
    //    $('#delete_session_button').attr('data-name', sessionData.name)
    //
    //    // TODO: handle this differently
    //    //$('#delete_modal').modal({
    //    //  backdrop: 'static'
    //    //})
    //  }
    //}

    //function hideConfirmModal(clearAll) {
    //  if (clearAll === true) {
    //    //$('#delete_modal').modal('hide')
    //    $('body').removeClass('modal-open')
    //    $('.modal-backdrop').remove()
    //  }
    //}

    function setInfoModal(title, msg, hideSpinner, hideReload, hideHome) {
      // Set titles and messages
      $('.info-span').html(msg)
      $('#infoModalLongTitle').html(title)

      // Open modal if not already open
      if ($('#info_modal').data('bs.modal') === undefined ||
          $('#info_modal').data('bs.modal').isShown === false) {

        // TODO: handle this differently
        //$('#info_modal').modal({
        //  backdrop: 'static',
        //  keyboard: false
        //})
      }

      // Toggle these elements as required
      if (typeof hideReload == 'undefined' || hideReload === true) {
        $('#pageReload').addClass('hidden')  // should be d-none, but bootstrap css not being applied?
      } else {
        $('#pageReload').removeClass('hidden')
      }

      if (typeof hideHome == 'undefined' || hideHome === true) {
        $('#hideHome').addClass('hidden')  // should be d-none, but bootstrap css not being applied?
      } else {
        $('#hideHome').removeClass('hidden')
      }

      if (typeof hideSpinner == 'undefined' || hideSpinner === true) {
        $('.spinner-span').addClass('hidden')
      } else {
        $('.spinner-span').removeClass('hidden')
      }

    }

    function hideInfoModal(clearAll) {
      // TODO: clean these up
      if (clearAll === true) {
        // TODO: handle this differently
        //$('#info_modal').modal('hide')
        $('body').removeClass('modal-open')
        $('.modal-backdrop').remove()
      }
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

    function checkAuthentication() {
      // TODO: temporary, for testing where there's no access to
      // access/login
      setAuthenticated()

      //userManager = new cadc.web.UserManager()
      //
      //// From cadc.user.js. Listens for when user logs in
      //userManager.subscribe(cadc.web.events.onUserLoad,
      //    function (event, data) {
      //      // Check to see if user is logged in or not
      //      if (typeof(data.error) !== 'undefined') {
      //        setNotAuthenticated()
      //      } else {
      //        setAuthenticated()
      //      }
      //    })
    }

    // #auth_modal is in /canfar/includes/_application_header.shtml
    function setNotAuthenticated() {
      // hide existing modal
      // TODO: this needs to be passed to sp_core at start then, rather that
      // get passed in via parameters into show/hideModal
      hideModal(_reactApp)

      //$('#auth_modal').modal({
      //  backdrop: 'static',
      //  keyboard: false
      //})

      // hide and disable the close button on the authentication
      // modal because authentication
      // is required for using this page
      $('#auth_modal button.close').addClass('disabled')
      $('#auth_modal button.close').addClass('hidden')

      $('.sp-form-body').addClass('hidden')
      $('.sp_not_authenticated').removeClass('hidden')

      $('.sp_not_authenticated').click(function() {
        //$('#auth_modal').modal('show')
         }
      )
    }

    function setAuthenticated() {
      $('.sp-form-body').removeClass('hidden')
      $('.sp_not_authenticated').addClass('hidden')
      trigger(_selfPortalCore, cadc.web.science.portal.core.events.onAuthenticated, {})
    }

    function hideModals() {
      $('.modal-backdrop').remove()
    }

    $.extend(this, {
      init: init,
      prepareRegistry: prepareRegistry,
      setSessionServiceURLs: setSessionServiceURLs,
      setAjaxSuccess: setAjaxSuccess,
      setAjaxFail: setAjaxFail,
      handleAjaxError: handleAjaxError,
      setProgressBar: setProgressBar,
      clearAjaxAlert: clearAjaxAlert,
      setConfirmModal: setConfirmModal,
      hideConfirmModal: hideConfirmModal,
      setInfoModal: setInfoModal,
      hideInfoModal: hideInfoModal,
      checkAuthentication: checkAuthentication,
      subscribe: subscribe,
      trigger: trigger,
      hideModals: hideModals,
      getRcDisplayText: getRcDisplayText,
      getRcDisplayTextPlusCode: getRcDisplayTextPlusCode,
      setModal: setModal,
      hideModal: hideModal
    })
  }

})(jQuery)
