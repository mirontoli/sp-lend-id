Talmac
=============

This SharePoint project is an HttpHandler for getting resources like images, styles and javascript from another source. There are two possible situations where it could be used:

1. Exposing some resources available only in local intranet to a public facing site like news images from intranet.
2. Transforming unsecure http links to SSL https links to [avoid browser warnings](http://stackoverflow.com/questions/3011222/dealing-with-http-content-in-https-pages/3042738#3042738)

The name talmac [тӑлмач](http://cv.wikipedia.org/wiki/%D0%A2%C4%83%D0%BB%D0%BC%D0%B0%D1%87) [/təlmaʨ/](http://www.forvo.com/word/%D1%82%D3%91%D0%BB%D0%BC%D0%B0%D1%87/#cv) means translator, interpreter. 

Steps
-----

Make `$SharePoint.Project.AssemblyFullName$` replaceable by adding this line to your .csproj file as it is pointet out on [stackoverflow](http://sharepoint.stackexchange.com/questions/25928/problem-with-wcf-web-service-in-sp2010/26009#26009) and [msdn](http://msdn.microsoft.com/en-us/library/ff521581.aspx):

    <TokenReplacementFileExtensions>ashx</TokenReplacementFileExtensions>


Security
--------
To ensure that only resources needed in the solution are rendered, we use an [md5 hash](http://stackoverflow.com/questions/3011222/dealing-with-http-content-in-https-pages/3042738#3042738).
