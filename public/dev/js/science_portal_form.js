;(function($) {
  // register namespace
  $.extend(true, window, {
    cadc: {
      web: {
        science: {
          portal: {
            form: {
              PortalForm: PortalForm,
              // Events
              events: {
                onLoadTypeMapDone: new jQuery.Event('sciPort:onLoadTypeMapDone'),
                onLoadTypeMapError: new jQuery.Event('sciPort:onLoadTypeMapError'),
                onLoadFormDataDone: new jQuery.Event('sciPort:onLoadFormDataDone'),
                onLoadFormDataError: new jQuery.Event('sciPort:onLoadFormDataError'),
                onLoadImageDataDone: new jQuery.Event('sciPort:onLoadImageDataDone'),
                onLoadImageDataError: new jQuery.Event('sciPort:onLoadImageDataError'),
                onLoadContextDataDone: new jQuery.Event('sciPort:onLoadContextDataDone'),
                onLoadContextDataError: new jQuery.Event('sciPort:onLoadContextDataError'),
              }
            }
          }
        }
      }
    }
  })


  /**
   * Class for handling data and interaction with Skaha for launching sessions
   * @constructor
   */
  function PortalForm() {
    var _selfPortalForm = this

    this._imageData = new Array()
    this._contextData = {}
    this._sessionTypeList = null
    this._sessionTypeMap = {}

    // Used to determine when all the data is collected from the form
    // 1 - call for context informtaion
    // 2 - n: for calls to get image lists for each type
    this._ajaxCallCount = 0

    // Values in this object will come from PortalCore
    this.sessionURLs = {}

    function setServiceURLs(URLObject) {
      // More than one endpoint is pulled from URLObject
      // so store entire thing
      _selfPortalForm.sessionURLs = URLObject
    }

    function setContentBase(contentBase) {
      // More than one endpoint is pulled from URLObject
      // so store entire thing
      _selfPortalForm.contentBase = contentBase
    }

    // ------ Session type functions
    function getSessionTypeList() {
      return _selfPortalForm._sessionTypeList
    }

    // -- init form data gather functions
    function getFormData() {

      // Set up counter for ajax calls used to load page data
      // context + image list
      _selfPortalForm._ajaxCallCount = 2;

      // Start loading context data
      _selfPortalForm.getContextData()

      // Start loading container image lists
      _selfPortalForm.getFullImageList()
    }


    //----------- sessionTypeMap functions

    /**
     * Get the a map of help text and headers from the content file
     */
    function loadSessionTypeMap() {
      // This information would be better pulled from skaha itself,
      // but it's not available yet
      var contentFileURL =  _selfPortalForm.contentBase + '/json/sessiontype_map_en.json'

      // Using a json input file because it's anticipated that the
      // number of sessions will increase fairly soon.
      $.getJSON(contentFileURL, function (jsonData) {
        _selfPortalForm._sessionTypeMap = jsonData

        // Build session type list
        var tempTypeList = new Array()
        for (var i = 0; i < _selfPortalForm._sessionTypeMap.session_types.length; i++) {
          // each entry has id, type, digest, only 'id' is needed
          tempTypeList.push( _selfPortalForm._sessionTypeMap.session_types[i].name)
        }
        _selfPortalForm._sessionTypeList = tempTypeList

        trigger(_selfPortalForm, cadc.web.science.portal.form.events.onLoadTypeMapDone)
      })
      // Used to reset launch form
      _selfPortalForm._sessionTypeMap.default = 'notebook'
    }

    function getSessionTypeDefault() {
      return _selfPortalForm._sessionTypeMap.default
    }

    function getMapEntry(sessionName) {
      for (var i = 0; i < _selfPortalForm._sessionTypeMap.session_types.length; i++) {
        if (_selfPortalForm._sessionTypeMap.session_types[i].name === sessionName) {
          return _selfPortalForm._sessionTypeMap.session_types[i]
        }
      }
      return null
    }

    function isTypeInList(imageType) {
      var isInList = (element) => element === imageType
      var typeIndex = _selfPortalForm._sessionTypeList.findIndex(isInList)
      if (typeIndex === -1) {
        return false
      } else {
        return true
      }
    }


    // --------------- Image list functions

    function getFullImageList(){
      var fullListURL = _selfPortalForm.sessionURLs.images
      Promise.resolve(_getAjaxData(fullListURL))
        .then(function (imageList) {

          // init the image list structure to simplify the loop below
          _selfPortalForm._imageData = {}
          for (var j=0; j<_selfPortalForm._sessionTypeList.length; j++) {
            _selfPortalForm._imageData[_selfPortalForm._sessionTypeList[j]] = {
              'imageList': new Array(),
              "imageIDList": new Array()
            }
          }

          for (var i=0; i<imageList.length; i++) {
            var curImage = imageList[i]
            if (isTypeInList(curImage.type)) {
              // add into the imageList structure
              _selfPortalForm._imageData[curImage.type].imageList.push(curImage)
              _selfPortalForm._imageData[curImage.type].imageIDList.push(curImage.id)
            }
            // else skip is it's not a type currently supported in the UI for
            // launching sessions.
          }

          _selfPortalForm._ajaxCallCount--
          if (_selfPortalForm._ajaxCallCount === 0) {
            trigger(_selfPortalForm, cadc.web.science.portal.form.events.onLoadFormDataDone)
          }

        })
        .catch(function (message) {
          trigger(_selfPortalForm, cadc.web.science.portal.form.events.onLoadImageDataError, message)
        })
    }

    function getImageListForType(sessionType) {
      // return what it's asking for, in an array of IDs.
      var imageList = null
      if (typeof _selfPortalForm._imageData[sessionType] !== 'undefined') {
        return _selfPortalForm._imageData[sessionType].imageIDList
      } else {
        return imageList
      }
    }

    function getFormDataForType(sessionType, sessionName) {
      var _formData = {}
      _formData.contextData = _selfPortalForm._contextData
      _formData.imageList=  _selfPortalForm.getImageListForType(sessionType)
      _formData.types = _selfPortalForm._sessionTypeList
      _formData.selectedType = sessionType
      _formData.sessionName = sessionName

      var tmpMapEntry = _selfPortalForm.getMapEntry(sessionType)

      // Translate list of allowed fields into booleans for variable fields
      // ie: showRAM and showCores

      var showcores = false
      if (tmpMapEntry.form_fields.includes('cores')) {
        showcores = true
      }
      var showram = false
      if (tmpMapEntry.form_fields.includes('memory')) {
        showram = true
      }
      _formData.formFields = {'showCores': showcores, 'showRAM': showram}

      return _formData
    }


    // ---------- Context Data functions ----------

    function getRAMArray() {
      return _selfPortalForm._contextData.availableRAM
    }

    function getRAMDefault() {
      // Convert value to string. (The + "" will do just that.
      // They will come out of curContext as numbers that can't be compared sanely
      return _selfPortalForm._contextData.defaultRAM + ""
    }

    function getCoresArray() {
      return _selfPortalForm._contextData.availableCores
    }

    function getCoresDefault() {
      // Convert  value to string. (The + "" will do just that.
      // They will come out of curContext as numbers that can't be compared sanely
      return _selfPortalForm._contextData.defaultCores + ""
    }


    function interruptAjaxProcessing() {
      // Yes, basically a 'kill -9'
      _selfPortalForm._ajaxCallCount = -9
    }

    /**
     * Get context information from skaha
     */
    function getContextData() {
      Promise.resolve(_getAjaxData(_selfPortalForm.sessionURLs.context))
        .then(function(curContext) {
          // Check to see if functions have been interrupted
          if (_selfPortalForm._ajaxCallCount !== -9) {

            // Not everything sent from the server is used by the front end yet.
            // In future, the data can be stored as
            // _selfPortalForm._contextData.rawData, but it'd be a waste of storage
            // to do it currently.
            // Save items that are used by the front end
            _selfPortalForm._contextData.availableCores = curContext.availableCores
            _selfPortalForm._contextData.availableRAM = curContext.availableRAM
            _selfPortalForm._contextData.defaultCores = curContext.defaultCores
            _selfPortalForm._contextData.defaultRAM = curContext.defaultRAM

            _selfPortalForm._ajaxCallCount--
            if (_selfPortalForm._ajaxCallCount === 0) {
              trigger(_selfPortalForm, cadc.web.science.portal.form.events.onLoadFormDataDone)
            }
          }
        })
        .catch(function(message) {
          trigger(_selfPortalForm, cadc.web.science.portal.form.events.onLoadContextDataError, message)
        })
    }

    function _getAjaxData(serviceURL) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest()

        // 'load' is the XMLHttpRequest 'finished' event
        request.addEventListener(
          'load',
          function () {
            if (request.status === 200) {
              var jsonData = parseJSONStr(request.responseText)
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

    // ---------- Common functions ----------

    function parseJSONStr(data) {
      var parsedStr = ''
      if (data.length > 0) {
        var escapedStr = '';
        // This will escape any single backslashes so the JSON.parse passes.
        // Mostly to capture elements like \msun, etc.
        // Could definitely be more bomb-proof than it is, but it's a start
        // to capture known issues with titles and author names
        if (data.indexOf("\"") > 0) {
          escapedStr = (data + '').replace(/[\\]/g, '\\$&').replace(/\u0000/g, '\\0')
        } else {
          escapedStr = data
        }

        parsedStr = JSON.parse(escapedStr)
      }
      return parsedStr
    }


      // ---------- Event Handling Functions ----------

      function trigger(target, event, eventData) {
        $(target).trigger(event, eventData)
      }

      // ----------- Declare functions --------
      $.extend(this, {
        getContextData: getContextData,
        getRAMArray: getRAMArray,
        getRAMDefault: getRAMDefault,
        getCoresArray: getCoresArray,
        getCoresDefault: getCoresDefault,
        getFullImageList: getFullImageList,
        getImageListForType: getImageListForType,
        getSessionTypeDefault: getSessionTypeDefault,
        getSessionTypeList: getSessionTypeList,
        getMapEntry: getMapEntry,
        getFormData: getFormData,
        getFormDataForType: getFormDataForType,
        interruptAjaxProcessing: interruptAjaxProcessing,
        loadSessionTypeMap: loadSessionTypeMap,
        setContentBase: setContentBase,
        setServiceURLs: setServiceURLs,
        isTypeInList: isTypeInList
      })
    }

})(jQuery)
