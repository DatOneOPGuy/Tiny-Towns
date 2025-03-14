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

// Fetch all users from the database
$usersResult = $conn->query("SELECT id, username, hashpass FROM Users");

// Fetch all games from the database
$gamesResult = $conn->query("SELECT id, user_id, score, board, start_time, end_time FROM Games ORDER BY id DESC LIMIT 10");

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiny Towns</title>
    <style>
        table {
            width: 50%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

  <div>
    <?php if ($message): ?>
      <div><?php echo $message; ?></div>
    <?php endif; ?>
  </div>


  <h2>Users Table</h2>
  <table>
    <tr>
      <th>ID</th>
      <th>Username</th>
      <th>Hashed Password</th>
    </tr>
    <?php while ($row = $usersResult->fetch_assoc()): ?>
    <tr>
      <td><?php echo htmlspecialchars($row['id']); ?></td>
      <td><?php echo htmlspecialchars($row['username']); ?></td>
      <td><?php echo htmlspecialchars($row['hashpass']); ?></td>
    </tr>
    <?php endwhile; ?>
  </table>

  <h2>Games Table</h2>
  <table>
    <tr>
      <th>ID</th>
      <th>User ID</th>
      <th>Score</th>
      <th>Board</th>
      <th>Start Time</th>
      <th>End Time</th>
    </tr>
    <?php while ($row = $gamesResult->fetch_assoc()): ?>
    <tr>
      <td><?php echo htmlspecialchars($row['id']); ?></td>
      <td><?php echo htmlspecialchars($row['user_id']); ?></td>
      <td><?php echo htmlspecialchars($row['score']); ?></td>
      <td><?php echo htmlspecialchars($row['board']); ?></td>
      <td><?php echo htmlspecialchars($row['start_time']); ?></td>
      <td><?php echo htmlspecialchars($row['end_time']); ?></td>
    </tr>
    <?php endwhile; ?>
  </table>

</body>
</html>
