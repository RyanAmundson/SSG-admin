
<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);
include 'connection.php';
$con = fConnectToDatabase();

//mapping for filter abstraction
//prob should be in external file, maybe as JSON?
$topicHash = array(
  "water" => array
  (
  "Fisheries and AquaCulture",
  "Freshwater Resources",
  "Flooding",
  "Forest Management",
  "Habitat",
  "Intensive Farming",
  "Marine/NearShore",
  "Marine Mammals",
  "Nonpoint Source Pollution",
  "Nutrient Pollution",
  "Ocean Acidification",
  "Point Source Emmissions",
  "Restoration",
  "Shorelines",
  "Soil erosion",
  "Soils Contamination",
  "Storm water",
  "Water quality",
  "Water quantity",
  "Wetlands",
  "Water Availability"
  )
);
$subTopicHash = array(
  "Quality_Quantity_Restoration" =>
  array(
    "Intensive Farming",
    "Nonpoint Source Pollution Control",
    "Nutrient Pollution",
    "Ocean Acidification",
    "Restoration",
    "Soil erosion",
    "Point source emissions",
    "Stormwater",
    "Water Quantity",
    "Water Quality",
    "Flooding",
    "Water Availability"
  ),
  "Fresh_Water_Resources"=>
  array(
    "Freshwater Resources",
    "Habitat",
    "Wetlands"
  ),
  "Marine_Nearshore_Ecosystems"=>
  array(
    "Marine/Nearshore",
    "Marine Mammals",
    "Shorelines",
    "Habitat"
  ),
  "Fisheries_Aquacultures"=>
  array(
    "Fisheries and Aquaculture",
    "Habitat"
  )
);
$levelHash = array(
  "government" =>
  array(
    "State or provincial",
    "Multinational",
    "Federal",
    "Bi-National",
    "Multi-state/Province",
    "Local",
    "Regional",
    "Regional District or County"

  ),
  "nonGovernment"=>
  array(
    "Non-Government Organizations",
    "Researchers/Scientists",
    "Business/Industry",
    "Multi-Stakeholders"
  ),
  "CoastSalish" =>
  array(
    "Indiginous Nations"
  )
);
//==============================================================================
//Initialization
//==============================================================================
$subTopicFilters = array(); //sub-issue filters selected
$levelsFilters = array();   //organization type filters selected
$sectorFilters = array();   //sector filters selected

$sql ="";
$offset = 0;

//final array to be json encoded and sent back
$lawRes = array();
$actorRes = array();
$resArray = array();
//==============================================================================
//Determine type of request
//==============================================================================

//get offset of results for pagination
if(isset($_GET['offset'])){
  $offset = $_GET['offset'];
}

//check if they did a search
if(isset($_GET['search'])){
  $search = $_GET['search'];
  $topic=$_GET['topic'];
  htmlspecialchars($search);
  $sql = searchSQL($search,$topicHash,$subTopicHash,$topic,$offset);

}else if(isset($_GET['more'])){
  $more = $_GET['more'];
  getMore($more, $con);

}else{

  //get all the values sent over and fill filter arrays
  forEach($_GET as $key => $entry){
    switch($entry){
      case "topic":
      $topic=$key;
      //echo $topic;
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
  $sql = buildLawsSQL($topicHash,$subTopicHash,$levelHash,$topic,$subTopicFilters,$levelsFilters,$sectorFilters,$offset);
  $actorSql = buildPolicyActorSQL($topicHash,$subTopicHash,$levelHash,$topic,$subTopicFilters,$levelsFilters,$sectorFilters,$offset);
}

//==============================================================================
//Start building sql
//==============================================================================
$result = mysqli_query($con,$sql) or die(mysqli_error($con));
$result2= mysqli_query($con,$actorSql) or die(mysqli_error($con));

while($r = mysqli_fetch_assoc($result)) {

  $ID = $r['LawID'];
  $LawName = $r['LawName'];
  $TypeOfLaw = $r['TypeOfLaw'];
  $Nation = $r['Nation'];
  $Relevance =  $r['RelevanceToSalishSea'];
  $Description=  $r['Description'];

  $tempObj =
  Array(
    "LawID"=>$ID,
    "LawName"=>$LawName,
    "TypeOfLaw"=>$TypeOfLaw,
    "Nation"=>$Nation,
    "Relevance"=>$Relevance,
    "Description"=>$Description
  );

  array_push($lawRes,$tempObj);

}
while($r = mysqli_fetch_assoc($result2)) {

  $ID = $r['ActorID'];
  $ActorName = $r['ActorName'];
  $TypeOfActor = $r['TypeOfActor'];
  $Nation = $r['Nation'];
  $Relevance =  $r['RelevanceToSalishSea'];
  $Description=  $r['Description'];

  $tempObj =
  Array(
    "ActorID"=>$ID,
    "ActorName"=>$ActorName,
    "TypeOfActor"=>$TypeOfActor,
    "Nation"=>$Nation,
    "Relevance"=>$Relevance,
    "Description"=>$Description
  );

  array_push($actorRes,$tempObj);



}

//package and ship it all pretty and stuff
array_push($resArray,$lawRes);
array_push($resArray,$actorRes);

echo json_encode($resArray);





//==============================================================================
//build SQL
//==============================================================================

//curently not in use?
function searchSQL($search,$topicHash,$subTopicHash,$topic,$offset){

  $viewSql = "SELECT * FROM IssuesAndLaws Where ";
  forEach($topicHash[$topic] as $tH){
    $viewSql .= "IssueType like '%".$tH."%' OR ";
  }
  $viewSql = substr($viewSql,0,strlen($viewSql)-4);

  $sql = "SELECT Distinct LawName,`TypeOfLaw`,Nation, `RelevanceToSalishSea`,LawID,Description FROM ($viewSql) as View Where ".

  "IssueType like '%$search%' OR ".
  "`LevelOfGovernment` like '%$search%' OR ".
  "LawName like '%$search%' OR ".
  "`TypeOfLaw` like '%$search%' OR ".
  "`Nation` like '%$search%' OR ".
  "`LevelOfGovernment` like '%$search%'";


    //echo $sql;
   return $sql;

}


function buildLawsSQL($topicHash,$subTopicHash,$levelHash,$topic,$subTopicFilters,$levelsFilters,$sectorFilters,$offset){

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
      }
    }
    $sql = substr($sql,0,strlen($sql)-4);
    $sql .= ") ";
    $sql .= "AND ";
  }

  if(sizeof($sectorFilters) > 0){
    $sql .= "(";
    forEach($sectorFilters as $f){
      $sql .= "Scale like '%".$f."%' OR ";
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

function buildPolicyActorSQL($topicHash,$subTopicHash,$levelHash,$topic,$subTopicFilters,$levelsFilters,$sectorFilters,$offset){

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
      }
    }
    $sql = substr($sql,0,strlen($sql)-4);
    $sql .= ") ";
    $sql .= "AND ";
  }

  if(sizeof($sectorFilters) > 0){
    $sql .= "(";
    forEach($sectorFilters as $f){
      $sql .= "Scale like '%".$f."%' OR ";
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
  exit();

}
?>
