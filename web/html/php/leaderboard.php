<!DOCTYPE html>
<html lang="en">
<head></head>
<body>

<?php
$currentUser = 'tstark';  // This would be typically be saved in a session variable, 
                          // but we'll simplify it here by just hard-coding it.

$conn = new mysqli('db', 'root', 'root', 'tinytowns');
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}



$pointsQuery = 'SELECT username, SUM(score) AS points';
$pointsQuery .= ' FROM Users JOIN Games ON Users.id = user_id';
$pointsQuery .= ' GROUP BY username ORDER BY points DESC';
echo '<p>' . $pointsQuery . '</p>';
$pointsResultSet = $conn->query($pointsQuery);



$userIdQuery = 'SELECT id FROM Users WHERE username = "' . $currentUser . '"';
echo '<p>' . $userIdQuery . '</p>';
$userResultSet = $conn->query($userIdQuery);
$cid = $userResultSet->fetch_assoc()['id'];




$achievementsQuery = 'SELECT name';
$achievementsQuery .= ' FROM Achievements JOIN User_Achievements ON Achievements.id = User_Achievements.achievement_id';
$achievementsQuery .= ' WHERE user_id = ' . $cid;
echo '<p>' . $achievementsQuery . '</p>';
$acheivementsQueryResult= $conn->query($achievementsQuery);


echo '<table border="1">';
echo '<tr><th>Points</th><th>Name</th><th>Achievements</th></tr>';

foreach ($pointsResultSet as $row) {
  echo '<tr><td>' . $row['points'] . '</td><td>' . $row['username']. '</td><td>';
  

  $userIdQuery = 'SELECT id FROM Users WHERE username = "' . $row['username'] . '"';
  $userResultSet = $conn->query($userIdQuery);
  $cid = $userResultSet->fetch_assoc()['id'];

    
  $achievementsQuery = 'SELECT name';
  $achievementsQuery .= ' FROM Achievements JOIN User_Achievements ON Achievements.id = User_Achievements.achievement_id';
  $achievementsQuery .= ' WHERE user_id = ' . $cid;
  $acheivementsQueryResult= $conn->query($achievementsQuery);

  $numRows = $acheivementsQueryResult->num_rows;
  $count = 0;

  foreach ($acheivementsQueryResult as $arow) {
    echo $arow['name'];
    if ($count < $numRows - 1) {
        echo ', ';
    }
    $count++;
}
echo '</td></tr>';
}

echo '</tbody></table>';



// What you have to do now is modify the stuff above to produce a table like the following:
/*
+--------+----------+-------------------------------+
| Points | Name     | Achievements                  |
+--------+----------+-------------------------------+
| 75     | nromanov | Perfect Town, Master Builder  |
| 60     | srogers  | Speed Runner                  |
| 52     | tstark   |                               |
+--------+----------+-------------------------------+

*/


?>

</body>
</html>