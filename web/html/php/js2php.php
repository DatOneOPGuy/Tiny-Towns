<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>The Javascript value is...</h1>
    <p style="text-align: center; font-size: 400%; color: #f00">
    <?php 
      $jsval = $_POST['jsval']; 
      echo $jsval;

      // To insert into the Games table, you would say
      //
      // $uid = run query and fetch first value
      // Select id FROM Users Where username='whatever'
      // INSERT INTO Games (user_id, score, board, start_time)
      // VALUES ('myid', myscore, 'boardstate', mystarttime)


    ?>
    </p>
  </body>
</html>