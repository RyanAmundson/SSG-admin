
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
  if(!empty($_GET['more'])){// && is_int($_GET['more']) && $_GET['more'] < 100000
    getMore($_GET['more'], $con);
    exit(0);
  } else {
    $offset = $_GET['offset'];
    $filters = populateFilters();
    $sql = buildSQL($topicHash,$subTopicHash,$levelHash,$sectorHash,$filters['topic'],$filters['subTopicFilters'],$filters['levelsFilters'],$filters['sectorFilters'],$offset);
    $result = mysqli_query($con,$sql) or die(mysqli_error($con));
    $lawResults = buildResults($result);
    echo json_encode($lawResults);
  }
}

//==============================================================================
//functions
//==============================================================================

function populateFilters(){
  $subTopicFilters = array(); //sub-issue filters selected
  $levelsFilters = array();   //organization type filters selected
  $sectorFilters = array();   //sector filters selected
  //get all the values sent over and fill filter arrays
  $topic = "";
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

  $viewSql = "Select distinct LawsAgreements.LawID LawID, Issues.IssueType IssueType, LawName, TypeOfLaw, Nation, LevelOfGovernment, Description, RelevanceToSalishSea, Scale, GeographicScope, Website ".
  "FROM LawsAgreements, Law_Issue, Issues ".
  "Where LawsAgreements.LawID = Law_Issue.LawID and Law_Issue.IssueID = Issues.IssueID and (";
  forEach($topicHash[$topic] as $tH){
    $viewSql .= "IssueType like '%".$tH."%' OR ";
  }
  $viewSql = substr($viewSql,0,strlen($viewSql)-4);
  $viewSql .= ")";
  $sql = "SELECT distinct LawID, IssueType, LawName, TypeOfLaw, Nation, LevelOfGovernment, Description, RelevanceToSalishSea, Scale, GeographicScope, Website FROM ($viewSql) as View Where ";

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
        $sql .= "Nation like '%".$sTH."%' OR ";
        $sql .= "LevelOfGovernment like '%".$sTH."%' OR ";
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
  $sql .= " Group by LawID ";
  //$sql .= " Limit 10 Offset ".$offset;
  //echo $sql."<br>";

  return $sql;
}

function buildResults($result){
  $lawRes = array();
  while($r = mysqli_fetch_assoc($result)) {

    $tempObj =
    Array(
    "LawID"=>$r['LawID'],
    "LawName"=>$r['LawName'],
    "TypeOfLaw"=>$r['TypeOfLaw'],
    "Nation"=>$r['Nation'],
    "Relevance"=>$r['RelevanceToSalishSea'],
    "Description"=>$r['Description'],
    "Website"=>$r['Website'],
    "IssueType"=>$r['IssueType']
    );

  array_push($lawRes,$tempObj);

  }

  return $lawRes;


}

function getMore($more, $con){
  $sql = "SELECT * FROM LawsAgreements, Law_Issue, Issues Where LawsAgreements.LawID = Law_Issue.LawID and Law_Issue.IssueID = Issues.IssueID and LawsAgreements.LawID ='$more'";

  $result = mysqli_query($con,$sql) or die(mysqli_error($con));

  $r = mysqli_fetch_assoc($result);


  $ID = $r['LawID'];
  $LawName = $r['LawName'];
  $TypeOfLaw = $r['TypeOfLaw'];
  $Nation = $r['Nation'];
  $Relevance =  $r['RelevanceToSalishSea'];
  $description = $r['Description'];
  $website = $r['Website'];
  $IssueType = $r['IssueType'];
  $GeoScope = $r['GeographicScope'];

  $tempObj = Array("ID"=>$ID,"LawName"=>$LawName,"TypeofLaw"=>$TypeOfLaw,"Nation"=>$Nation,"Relevance"=>$Relevance,"Description"=>$description,"Website"=>$website,"IssueType"=>$IssueType,"GeoScope"=>$GeoScope);

  echo json_encode($tempObj);

}




?>
