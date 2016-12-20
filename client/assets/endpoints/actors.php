
<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);
include 'connection.php';
$con = fConnectToDatabase();

//mapping for filter abstraction
//prob should be in external file, maybe as JSON?
include_once('filtermappings.php');
//==============================================================================
//Initialization
//==============================================================================

//==============================================================================
//Determine type of request
//==============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if(!empty($_GET['more'])){// && is_int($_GET['more']) && $_GET['more'] <100000
    getMore($_GET['more'], $con);
  }
    $offset = $_GET['offset'] || 0;
    $filters = populateFilters();
    $sql = buildSQL($topicHash,$subTopicHash,$levelHash,$sectorHash,$filters['topic'],$filters['subTopicFilters'],$filters['levelsFilters'],$filters['sectorFilters'],$offset);
    $result = mysqli_query($con,$sql) or die(mysqli_error($con));
    $ActorResults = buildResults($result);
    echo json_encode($ActorResults);
}

//==============================================================================
//functions
//==============================================================================

function populateFilters(){
  $subTopicFilters = array(); //sub-issue filters selected
  $levelsFilters = array();   //organization type filters selected
  $sectorFilters = array();   //sector filters selected
  $topic ="";
  //get all the values sent over and fill filter arrays
  forEach($_GET as $key => $entry){
    switch($entry){
      case "topic":
        $topic=$key;
        break;
      case "sub":
        array_push($subTopicFilters,$key);
        break;
      case "level":
        array_push($levelsFilters,$key);
        break;
      case "sector":
        array_push($sectorFilters,$key);
        break;
      default:
        break;
    }
  }
  $filledFilters['topic'] = $topic;
  $filledFilters['subTopicFilters'] = $subTopicFilters;
  $filledFilters['levelsFilters'] = $levelsFilters;
  $filledFilters['sectorFilters'] = $sectorFilters;
  return $filledFilters;
}

function buildSQL($topicHash,$subTopicHash,$levelHash,$sectorHash,$topic,$subTopicFilters,$levelsFilters,$sectorFilters,$offset){

  $viewSql = "Select distinct PA.ActorID ActorID, ActorName, TypeOfActor, Nation, LevelOfGovernment, `Role/Responsibility`, Description, Active, RelevanceToSalishSea, Scale, Website,IssueType ".
  "from PolicyActors PA, Actor_Issue AI, Issues I ".
  "Where PA.ActorID = AI.ActorID and AI.IssueID = I.IssueID and (";
  forEach($topicHash[$topic] as $tH){
    $viewSql .= "IssueType like '%".$tH."%' OR ";
  }
  $viewSql = substr($viewSql,0,strlen($viewSql)-4);
  $viewSql .= ")";
  $sql = "Select distinct ActorID, ActorName, TypeOfActor, Nation, LevelOfGovernment, `Role/Responsibility`, Description, Active, RelevanceToSalishSea, Scale, Website,IssueType FROM ($viewSql) as View Where ";

  if(array_sum(array(sizeof($subTopicFilters),sizeof($sectorFilters),sizeof($levelsFilters))) == 0){

    $sql = substr($sql,0,strlen($sql)-6);

  }

  if(sizeof($subTopicFilters) > 0){

    $sql .= "(";
    forEach($subTopicFilters as $f){
      forEach($subTopicHash[$f] as $sTH){
        $sql .= "IssueType like '%".$sTH."%' OR ";
      }
    }
    $sql = substr($sql,0,strlen($sql)-4);
    $sql .= ") ";
    $sql .= "AND ";
  }

  if(sizeof($levelsFilters) > 0){
    $sql .= "(";
    forEach($levelsFilters as $f){
      forEach($levelHash[$f] as $sTH){
        $sql .= "Scale like '%".$sTH."%' OR ";
        $sql .= "LevelOfGovernment like '%".$sTH."%' OR ";
        $sql .= "Nation like '%".$sTH."%' OR ";
      }
    }
    $sql = substr($sql,0,strlen($sql)-4);
    $sql .= ") ";
    $sql .= "AND ";
  }

  if(sizeof($sectorFilters) > 0){
    $sql .= "(";
    forEach($sectorFilters as $f){
      forEach($sectorHash[$f] as $sH){
        $sql .= "Scale like '%".$sH."%' OR ";
        $sql .= "LevelOfGovernment like '%".$sH."%' OR ";
        $sql .= "Nation like '%".$sH."%' OR ";
      }
    }
    $sql = substr($sql,0,strlen($sql)-4);
    $sql .= ") ";
  }else{
    $sql = substr($sql,0,strlen($sql)-4);
  }
  $sql .= " Group by ActorID ";
  //$sql .= " Limit 10 Offset ".$offset;
  //echo $sql."<br>";

  return $sql;
}

function buildResults($result){
  $actorRes = array();
  while($r = mysqli_fetch_assoc($result)) {

    $tempObj =
    Array(
      "ActorID"=>$r['ActorID'],
      "ActorName"=>$r['ActorName'],
      "TypeOfActor"=>$r['TypeOfActor'],
      "Nation"=>$r['Nation'],
      "Relevance"=>$r['RelevanceToSalishSea'],
      "Description"=>$r['Description'],
      "Website"=>$r['Website'],
      "IssueType"=>$r['IssueType']
    );

    array_push($actorRes,$tempObj);



  }

 return $actorRes;


}

function getMore($more, $con){
  $sql = "Select distinct PA.ActorID ActorID, ActorName, TypeOfActor, Nation, LevelOfGovernment, `Role/Responsibility`, Description, Active, RelevanceToSalishSea, Scale, Website,IssueType ".
  "from PolicyActors PA, Actor_Issue AI, Issues I ".
  "Where PA.ActorID = '$more'";
  $result = mysqli_query($con,$sql) or die(mysqli_error($con));

  $r = mysqli_fetch_assoc($result);


  $tempObj = Array(
    "ActorID"=>$r['ActorID'],
    "ActorName"=>$r['ActorName'],
    "TypeOfActor"=>$r['TypeOfActor'],
    "Nation"=>$r['Nation'],
    "Relevance"=>$r['RelevanceToSalishSea'],
    "Description"=>$r['Description'],
    "Website"=>$r['Website'],
    "IssueType"=>$r['IssueType']
  );
  echo json_encode($tempObj);
  exit();

}
?>
