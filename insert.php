
<?php
$servername = "localhost";
$database = "climacol_network";
$username = "climacol_roly";
$password = "!WV5alc@d47X";

// Create connection

$conn = mysqli_connect($servername, $username, $password, $database);

// Check connection

if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
}
 
echo "Connected successfully";

//gte the vars
$name = test_input($_POST["name"]);
$email = test_input($_POST["email"]);
$org = test_input($_POST["org"]);
 
$sql = "INSERT INTO people ( `name`, `email`, `organisation`) VALUES ( '$name', '$email', '$org')";
if (mysqli_query($conn, $sql)) {
      echo "New record created successfully";
} else {
      echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
mysqli_close($conn);
header('Location: datos.php?success');
exit;
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>
