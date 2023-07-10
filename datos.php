<!DOCTYPE html>
<!-- HTML5 Boilerplate -->
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->

<head>

	<meta charset="utf-8">
	<!-- Always force latest IE rendering engine & Chrome Frame -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>clima-colombia</title>
	<meta name="description" content="">
	<meta name="keywords" content="">

	<meta name="author" content="www.clima-colombia.org">

	<meta http-equiv="cleartype" content="on">

	<link rel="shortcut icon" href="/favicon.ico">

	<!-- Responsive and mobile friendly stuff -->
	<meta name="HandheldFriendly" content="True">
	<meta name="MobileOptimized" content="320">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<!-- Stylesheets -->
	<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Droid Sans Mono">
	<link href="https://fonts.googleapis.com/css?family=EB+Garamond" rel="stylesheet">
	<link rel="stylesheet" href="cc.css" media="all">
	<script src = "fns.js" ></script>
<script src="/d3/d3.v4.min.js"></script>
<script src="/d3/topojson.v2.min.js"></script>

<script src="/tools/ideamStationLocation.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="download.js"></script>

</head>
<style type="text/css">

#points {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}
#chart{
	position: relative;
}
            #content{
            	font-size: smaller;
            }
            h3{
                display:inline;
            }
            #downloaddiv{
	        display: none;
	        position: absolute;
	        text-align: left;
			z-index: 3;
	        padding: 8px;
	        margin-top: -20px;

	        background: #ddd;
	        
	        }
	        #networkform, #networkformthanks{
	        	
	        	position: fixed;
				width: 350px;
				height: 600px;
				margin: 1% auto; 
				left: 0;
				right: 0;
				background: #ddd;
				z-index: 11;
	        padding: 8px;
	        }
	        input[type=text],input[type=email], select {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}
input[type=submit] {
    width: 100%;
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
#networkform button,#networkformthanks button {
	display: inline-block;
	width: 100%;
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}	
        
.close{
	position: absolute;
    top: 0px;
    right: 0px;
    left: auto;

    margin: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: white;
    padding: 5px;
}	
</style>
<body>
 <div id = "networkformthanks">
 	<div class="close" onclick="hideNetworkThanksForm()"><h3>X</h3></div>
 	<h1>Thanks</h1>
			<h3>For sharing your contact information with the clima-colombia.org network</h3>
			
			<button type="button" onclick="hideNetworkThanksForm()">Explore the data.</button>

        </div>
	<div id = "networkform">
		<div class="close" onclick="hideNetworkForm()"><h3>X</h3></div>
			
				<h1>Join the network</h1>
				<h3>Before you download and explore our data please consider sharing your contact information with the clima-colombia.org network</h3>
				<form method="post" action="insert.php">  
				<label>Your name:</label> <input type="text" name="name" required>
				<label>Your e-mail:</label> <input type="email" name="email" required>
				<label>Your organisation:</label> <input type="text" name="org" required>
				<input type = "submit" name = "submit" value = "Please add me to the network.">
				<button type="button" onclick="hideNetworkForm()">I am already part of the network.</button>
				<button type="button" onclick="hideNetworkForm()">Maybe later.</button>
			
			</form>
			
        </div>	
       	
<div id = "container">
	<div id="header">
	<div id="menu"></div>	
	</div>
    
	<div id="content">

		<div id = "title"></div>

        <div id = "control"></div> 
        <div id = "chart"><A NAME="MAP"></A><div id = "points"></div><div id = "downloaddiv"></div></div>
        
        <div id = "description"> 
        Geodata using <a href="https://github.com/d3/d3-geo">d3-geo</a> and <a href="https://github.com/">topojson</a>.
        </div>
		
	</div>
	<div id="footer"></div>

</div>


</body>

<script type="text/javascript">
makePage();
runMap();
makeDataPage();
//

</script>
</html>