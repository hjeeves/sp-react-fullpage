<%@ page import="ca.nrc.cadc.web.Configuration" %>
<%@ page import="ca.nrc.cadc.web.ApplicationConfiguration" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" session="false" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<meta http-equiv="Cache-control" content="no-cache">

<%
  final ApplicationConfiguration configuration = new ApplicationConfiguration(Configuration.DEFAULT_CONFIG_FILE_PATH);
  final String sessionsResourceID = configuration.lookup("org.opencadc.science-portal.sessions.resourceID");

  String bannerText = configuration.lookup("org.opencadc.science-portal.sessions.bannerText");

  if (bannerText == null) {
      bannerText = "";
  }
%>

<!-- Default to current host. -->
<c:if test="${empty baseURL}">
  <c:set var="req" value="${pageContext.request}" />
  <c:set var="url">${req.requestURL}</c:set>
  <c:set var="uri" value="${req.requestURI}" />
  <c:set var="baseURL" value="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}" />
</c:if>

<c:set var="resourceCapabilitiesEndPoint" value="${baseURL}/reg/resource-caps" />
<c:set var="contextPath" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/" />

    <!-- Located in ROOT.war -->
    <script type="application/javascript" src="${baseURL}/canfar/javascript/jquery-2.2.4.min.js"></script>
<%--    <script type="application/javascript" src="${baseURL}/canfar/jasvascript/bootstrap.min.js"></script>--%>

    <!-- BANNER WARNING -->
<%--    <div class="panel panel-warning">--%>
<%--      <div class="panel-heading cadc-warn-heading"></div>--%>
<%--      <div class="panel-body cadc-warn-body">--%>
<%--        <p>CADC and CANFAR services will be unavailable from September 16th, 1700PDT to September 20 1200PDT due to a planned power outage.  This outage is required for a major upgrade to the CADC’s data centre power systems.</p>--%>
<%--      </div>--%>
<%--    </div>--%>
    <!-- END BANNER WARNING -->

    <!-- Add Promises if missing/broken. -->
    <script type="application/javascript" src="https://cdn.jsdelivr.net/npm/es6-promise/dist/es6-promise.auto.js"></script>
    <!-- Found in canfar-root: tomcat(-canfar)/webapps/ROOT unless an absolue URL -->
    <script type="text/javascript" src="/cadcJS/javascript/cadc.registry-client.js"></script>
    <script type="text/javascript" src='/cadcJS/javascript/org.opencadc.js'></script>
    <script type="text/javascript" src='/cadcJS/javascript/cadc.uri.js'></script>
    <script type="text/javascript" src="/cadcJS/javascript/cadc.user.js"></script>
    <script type="text/javascript" src="/canfar/javascript/cadc.redirect.util.js"></script>

    <!-- Adding gdpr cookie banner -->
    <script type="text/javascript" src="/cadcJS/javascript/cadc.gdpr.cookie.js"></script>
    <link  type="text/css" href="/canfar/css/cadc.gdpr.cookie.css" rel="stylesheet" media="screen">

    <!-- Adding css for info banner - needs to override bootstrap panel styling -->
    <link type="text/css" href="/canfar/css/cadc.info.banner.css?version=@version@" rel="stylesheet" media="screen">


    <!--[if lt IE 9]>
<!--        <script src="/html5shiv.googlecode.com/svn/trunk/html5.js"></script>-->
    <![endif]-->

    <script type="application/javascript">
      window.runStartupTasks = () => {}
    </script>

    <title>Science Portal</title>
  </head>

  <body>
<%--    <c:import url="${baseURL}/canfar/includes/_application_header.shtml" />--%>
    <div class="container-fluid fill">
      <div class="row fill">
        <div role="main" class="col-sm-12 col-md-12 main fill">
          <div class="inner fill">
            <section id="main_content" class="fill">

              <%--  CANFAR React App loads here --%>
              <div class="science-portal-authenticated">
                <div id="sp_listnavbar" class="panel panel-default sp-panel">

                <div id="react-mountpoint"></div>

              <!-- Content ends -->
            </section>
          </div>
        </div>
      </div>
    </div>

    <%--local files ot pick up--%>
    <script src="dist/react-app.js"></script>
    <script type="application/javascript" src="dist/js/science_portal_core.js"></script>
    <script type="application/javascript" src="dist/js/science_portal_session.js"></script>
    <script type="application/javascript" src="dist/js/science_portal_form.js"></script>
    <script type="application/javascript" src="dist/js/science_portal.js"></script>

    <script type="application/javascript" src="dist_config/sp_dist_config.js"></script>



    <script type="application/javascript">

      $(document).ready(function() {

        // Set up controller for Science Portal Session Launch page
        launch_js = new cadc.web.science.portal.PortalApp({
          baseURL: window.location.origin,
          sessionsResourceID: '<%= sessionsResourceID %>',
          bannerText: '<%= bannerText %>',
          contentBase: contentBase
        })

        launch_js.init()
      });

    </script>

  </body>

</html>

