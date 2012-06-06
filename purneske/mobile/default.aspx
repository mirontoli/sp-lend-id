<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hello
        </title>
        <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.css" />
		
		<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/headjs/0.96/head.min.js"></script>

		<!-- Load all other scripts async and run sync: -->
		<script type="text/javascript">
			head.js("//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",
				"//code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.js", 
				"//cdnjs.cloudflare.com/ajax/libs/knockout/2.0.0/knockout-min.js",
				"//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/0.7.1a/jquery.SPServices-0.7.1a.min.js",
				"CustomerModel.js",
                "CustomerViewModel.js",
                "CustomerRepository.js",
                "app.js?v=3" );
		</script>
    </head>
    <body>
        <div data-role="page" id="page1">
            <div data-theme="a" data-role="header">
                <h3>
                    Customers
                </h3>
            </div>
            <div data-role="content">
                <div class="loadingMessage" style="display:none;">
                    Loading data... please wait...
                </div>
				<ul id="customers" data-role="listview" data-divider-theme="b" data-inset="true" data-bind="foreach: allCustomers" style="display:none;">
                    <li data-theme="c">
                        <a href="#" data-transition="slide">
							<span data-bind="text: firstName"></span>
							<span data-bind="text: lastName"></span>
							<span data-bind="text: city"></span>
                        </a>
                    </li>
                </ul>
            </div>
            <div data-theme="a" data-role="footer">
                <h3>
                    &copy; Tolle 2012
                </h3>
            </div>
        </div>
    </body>
</html>