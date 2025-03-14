<?php
session_start();
include 'db_connect.php';

$message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $user = $_POST['username'];
  $pass = $_POST['password'];

  $stmt = $conn->prepare('SELECT hashpass FROM Users WHERE username=?');
  $stmt->bind_param('s', $user);
  $stmt->execute();
  $stmt->store_result();

  if ($stmt->num_rows > 0) {
    $stmt->bind_result($hashpass);
    $stmt->fetch();
    if (password_verify($pass, $hashpass)) {
      $_SESSION['user'] = $user;
      header('Location: ../tinytowns.html');
      exit();
    } else {
      $message = 'Invalid login.';
    }
  }

  $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiny Towns Login</title>
    <style>
      @import url('https://fonts.googleapis.com/css?family=Cinzel');

      body {
        font-family: 'Cinzel', sans-serif;
        background-image: url('/images/wood-texture.jpg');
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }

      .container {
        background-color: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
      }

      .login-box {
        display: flex;
        flex-direction: column;

        height: 100%;
      }

      .login-box input {
        display: flex;
        width: 370px;
        padding: 15px;
        margin: 15px 0;
        border: 1px solid #ddd;
        border-radius: 5px;
      }

      .login-box button {
        width: 100%;
        padding: 15px;
        margin: 10px 0;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
      }

      .login-box button:hover {
        background-color: #0056b3;
      }

      .login-box a {
        color: #007bff;
        text-decoration: none;
        text-align: center;
        display: block;
        margin-top: 10px;
      }

      .login-box a:hover {
        text-decoration: underline;
      }

      .message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 10px;
        border: 1px solid #f5c6cb;
        border-radius: 5px;
        margin-bottom: 20px;
        text-align: center;
      }
    </style>
</head>
<body>

  <div class="container">
    <?php if ($message): ?>
      <div class="message"><?php echo $message; ?></div>
    <?php endif; ?>

    <div class="login-box">
      <form action="" method="POST">
        <input type="text" id="username" name="username" required placeholder="Username">
        <input type="password" id="password" name="password" required placeholder="Password">
        <button type="submit">Login</button>
      </form>
      <a href="register.php">Register</a>
    </div>
  </div>

</body>
</html>