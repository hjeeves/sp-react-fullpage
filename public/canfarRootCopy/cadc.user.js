; (function ($, window, undefined) {
  // Register namespace
  $.extend(true, window, {
    cadc: {
      web: {
        json: {
          babelfish: {
            VALUE_KEY: '$',
            ATTRIBUTE_KEY_PREFIX: '@'
          }
        },
        auth: {
          resourceID: 'ivo://cadc.nrc.ca/gms',
          interfaceURI: 'http://www.ivoa.net/xml/VODataService/v1.1#ParamHTTP',
          authType: 'cookie',
          whoami: {
            standardID: 'ivo://ivoa.net/std/UMS#whoami-0.1'
          },
          user: {
            standardID: 'ivo://ivoa.net/std/UMS#users-0.1'
          },
          modify_password: {
            standardID: 'ivo://ivoa.net/std/UMS#modpass-0.1'
          },
          reset_password: {
            standardID: 'ivo://ivoa.net/std/UMS#resetpass-0.1'
          }
        },
        User: User,
        UserManager: UserManager,
        WHOAMI_ENDPOINT: '/access/control/proxy',

        USER_CREATE_ENDPOINT: '/access/control/proxy',

        USER_PASSWORD_CHANGE_ENDPOINT: '/access/control/proxy',

        // Need to replace {1} with the User ID
        // (See org.opencadc.StringUtil.format() in org.opencadc.js)!
        USER_ACCOUNT_ENDPOINT: '/ac/users/{1}?idType=HTTP',

        events: {
          onUserLoad: new jQuery.Event('onUserLoad'),
          onUserUpdate: new jQuery.Event('onUserUpdate')
        }
      }
    }
  })

  /**
   * Class to manage a User via web service calls.
   * @constructor
   * @param {} input  Input options
   * @param {Registry | {}} [input.registryClient]  Registry client to use for AC service calls.  Optional.
   *        Defaults to local /ac service.
   */
  function UserManager (input) {
    this.user = null
    this.registryClient = (input && input.registryClient) || new Registry()
    this.baseURL = (input && input.registryClient) || ""

    function getObjectValue (_jsonObject, _jsonObjectKey) {
      return _jsonObject.hasOwnProperty(_jsonObjectKey)
        ? _jsonObject[_jsonObjectKey][cadc.web.json.babelfish.VALUE_KEY]
        : null
    }

    /**
     * Load the user into this manager from the given JSON.
     *
     * @param json    JSON Data.
     */
    this.loadUser = function (json) {
      var userID
      var identities = json.user.identities[cadc.web.json.babelfish.VALUE_KEY]
      for (var i = 0; i < identities.length; i++) {
        var identity = identities[i]
        if (
          identity.identity[
          cadc.web.json.babelfish.ATTRIBUTE_KEY_PREFIX + 'type'
          ] === 'HTTP'
        ) {
          userID = identity.identity[cadc.web.json.babelfish.VALUE_KEY]
          break
        }
      }

      var personalDetail = json.user.personalDetails
      if (!personalDetail) {
        personalDetail = {}
      }

      this.setUser(
        new cadc.web.User(
          userID,
          getObjectValue(personalDetail, 'firstName'),
          getObjectValue(personalDetail, 'lastName'),
          getObjectValue(personalDetail, 'email'),
          getObjectValue(personalDetail, 'institute')
        )
      )
    }

    // For testing!
    this.TEST_LOAD_USER = this.loadUser

    this.fire = function (event, eventData) {
      var eData = eventData || {}
      eData.userManager = this

      $(document).trigger(event, eData)
    }

    this.loadCurrentUserFromService = function (endpoint) {
      $.ajax({
        method: 'GET',
        dataType: 'json',
        url: endpoint,
        jsonp: false,
        headers: {
          Accept: 'application/json'
        },
        data: {
          STANDARD_ID: cadc.web.auth.whoami.standardID,
          INTERFACE_TYPE_ID: cadc.web.auth.interfaceURI,
          RESOURCE_ID: cadc.web.auth.resourceID,
          AUTH_TYPE: cadc.web.auth.authType
        },
        xhrFields: {
          withCredentials: true
        }
      })
        .done(
          function (data) {
            this.loadUser(data)
            this.fire(cadc.web.events.onUserLoad, { user: this.user })
          }.bind(this)
        )
        .fail(
          function (jqXHR, textStatus, errorThrown) {
            this.fire(cadc.web.events.onUserLoad, {
              errorStatus: jqXHR.status,
              errorMessage: textStatus,
              error: errorThrown
            })
          }.bind(this)
        )
    }

    /**
     * Load the currently authenticated user.
     */
    this.loadCurrent = function () {
      this.loadCurrentUserFromService(cadc.web.WHOAMI_ENDPOINT)
    }

    /**
     * Obtain the user object as JSON.
     *
     * @returns {String}    JSON string of form data.
     */
    this.serializeFormDataAsJSON = function (
      _username,
      _$personalDetailItemsArray
    ) {
      var identity = {
        identity: {
          '@type': 'HTTP',
          $: _username
        }
      }

      var personalDetails = this.serializeUserDetailsAsJSON(
        _$personalDetailItemsArray
      )
      var formDataObject = {
        user: {
          identities: {
            $: [identity]
          }
        }
      }

      formDataObject.user.personalDetails = personalDetails

      return JSON.stringify(formDataObject)
    }

    this.serializeUserDetailsAsJSON = function (_$personalDetailItemsArray) {
      var personalDetail = {}

      _$personalDetailItemsArray.each(function () {
        var $nextFormItem = $(this)

        personalDetail[$nextFormItem.attr('name')] = {
          $: $nextFormItem.val() || ''
        }
      })

      return personalDetail
    }

    this.updateUser = function (_$personalDetailItemsArray) {
      var userID = this.user.getUserID()
      var formDataJSON = this.serializeFormDataAsJSON(
        userID,
        _$personalDetailItemsArray
      )
      $.ajax({
        url: '/access/control/proxy',
        method: 'POST',
        // contentType: 'application/json',
        // mimeType: 'application/json',
        dataType: 'text',
        headers: { Accept: 'application/json' },
        data: {
          DATA: formDataJSON,
          DATA_CONTENT_TYPE: 'application/json',
          EXTRA_PATH: userID,
          STANDARD_ID: cadc.web.auth.user.standardID,
          INTERFACE_TYPE_ID: cadc.web.auth.interfaceURI,
          RESOURCE_ID: cadc.web.auth.resourceID,
          AUTH_TYPE: cadc.web.auth.authType,
        }
      })
        .done(
          function () {
            this.fire(cadc.web.events.onUserUpdate, {})
          }.bind(this)
        )
        .fail(
          function (xhr) {
            this.fire(cadc.web.events.onUserUpdate, {
              errorStatus: xhr.status,
              errorMessage:
                'Error (' +
                xhr.status +
                '): ' +
                'unable to update your Profile.' +
                ' (' +
                xhr.responseText +
                ') '
            })
          }.bind(this)
        )
    }

    this.getUser = function () {
      return this.user
    }

    this.setUser = function (__user) {
      this.user = __user
    }

    this.subscribe = function (event, eHandler) {
      $(document).on(event.type, eHandler)
    }
  }

  /**
   * Represents a user as per Form data.
   *
   * @param _userID       The CADC User ID.
   * @param _firstName    First name
   * @param _lastName     Last name
   * @param _email        Email
   * @param _institute    Institute
   * @constructor
   */
  function User (
    _userID,
    _firstName,
    _lastName,
    _email,
    _institute
  ) {
    this.userID = _userID
    this.firstName = _firstName
    this.lastName = _lastName
    this.email = _email
    this.institute = _institute

    this.getUserID = function () {
      return this.userID
    }

    this.getFirstName = function () {
      return this.firstName
    }

    this.getLastName = function () {
      return this.lastName
    }

    this.getFullName = function () {
      return this.getFirstName() + ' ' + this.getLastName()
    }

    this.getEmail = function () {
      return this.email
    }

    this.getInstitute = function () {
      return this.institute
    }
    
  }
})(jQuery, window)
