<?php

$topicHash = array(
  "full-report" => array
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
  "Soil Erosion",
  "Soils Contamination",
  "Storm water",
  "Water quality",
  "Water quantity",
  "Wetlands",
  "Water Availability",
  "Contaminated Sites",
  "Disaster and Other Natural Hazards",
  "Development and Land Use",
  "Ecosystem Services",
  "Flooding",
  "Forest Management",
  "Landslide",
  "Light Pollution",
  "Solid Waste",
  "Public Lands",
  "Urban Sprawl",
  "Urbanization",
  "Dredging and Ocean Dumping",
  "Emerging Contaminants",
  "Energy",
  "Energy Transport",
  "Human Health",
  "Ocean Dumping",
  "Oil Spills",
  "Pesticides",
  "Soils Contamination",
  "Toxic Substances",
  "Wastewater Management",
  "Contaminated Sites",
  "Endangered Species",
  "Fisheries and Aquaculture",
  "Habitat",
  "Public Lands",
  "Salmon Recovery",
  "Wildlife and Biodiversity",
  "Air Quality",
  "Climate Change"
  ),
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
  "Soil Erosion",
  "Soils Contamination",
  "Storm water",
  "Water quality",
  "Water quantity",
  "Wetlands",
  "Water Availability"
  ),
  "land" => array
  (
  "Contaminated Sites",
  "Disaster and Other Natural Hazards",
  "Development and Land Use",
  "Ecosystem Services",
  "Flooding",
  "Forest Management",
  "Landslide",
  "Light Pollution",
  "Solid Waste",
  "Public Lands",
  "Urban Sprawl",
  "Urbanization"
  ),
  "pollution" => array
  (
  "Dredging and Ocean Dumping",
  "Emerging Contaminants",
  "Energy",
  "Energy Transport",
  "Human Health",
  "Ocean Dumping",
  "Oil Spills",
  "Pesticides",
  "Soils Contamination",
  "Toxic Substances",
  "Wastewater Management",
  "Contaminated Sites"
  ),
  "conservation" => array
  (
  "Endangered Species",
  "Fisheries and Aquaculture",
  "Habitat",
  "Public Lands",
  "Salmon Recovery",
  "Wildlife and Biodiversity"
  ),
  "air" => array
  (
  "Air Quality",
  "Climate Change"
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
    "Soil Erosion",
    "Point source emissions",
    "Stormwater",
    "Water Quantity",
    "Water Quality",
    "Flooding",
    "Water Availability"
  ),
  "Freshwater_Resources"=>
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
  "Fisheries_Aquaculture"=>
  array(
    "Fisheries and Aquaculture",
    "Habitat"
  ),
  "Public_Lands"=>
  array(
    "Habitat",
    "Public Lands"
  ),
  "Air_Quality"=>
  array(
    "Air Quality"
  ),
  "Climate_Change"=>
  array(
    "Climate Change"
  ),
  "Contaminated_Sites"=>
  array(
    "Contaminated Sites",
    "Soils Contamination"
  ),
  "Development_Permitting_Land_Use_Planning"=>
  array(
    "Disaster and Other Natural Hazards",
    "Development/Land Use",
    "Flooding",
    "Forest Management",
    "Landslide",
    "Light Pollution",
    "Urban Sprawl",
    "Urbanization"
  ),
  "Dredging_Ocean_Dumping"=>
  array(
    "Dredging and Ocean Dumping",
    "Ocean Dumping"
  ),
  "Toxic_Substances"=>
  array(
    "Emerging Contaminants",
    "Human Health",
    "Pesticides",
    "Toxic Substances"
  ),
  "Endangered_Species/Species_at_Risk"=>
  array(
    "Endangered Species"
  ),
  "Energy_Transport"=>
  array(
    "Energy",
    "Energy Transport",
    "Oil Spills"
  ),
  "Wildlife_Biodiversity"=>
  array(
    "Habitat",
    "Wildlife and Biodiversity"
  ),
  "Salmon_Recovery"=>
  array(
    "Habitat",
    "Salmon Recovery"
  ),
  "Wastewater_Management"=>
  array(
    "Wastewater Management"
  )
);
$levelHash = array(
  "Government" =>
  array(
    "State or provincial",
    "Multinational",
    "Federal",
    "Bi-National",
    "Multi-state/Province",
    "Local",
    "Regional",
    "Regional District or County",
    "Hybrid"
  ),
  "Non-Government"=>
  array(
    "Non-Government Organizations",
    "Researchers/Scientists",
    "Business/Industry",
    "Multi-Stakeholders",
    "Hybrid"
  ),
  "Coast_Salish_Peoples" =>
  array(
    "Indigenous Nation",
    "Indigenous"
  )
);

// this maps the filter they select to the key words in the database
$sectorHash = array(
  "Bi-National" =>
  array(
    "Bi-National"
  ),
  "Multi-state" =>
  array(
    "Multi-state/Province",
    "Multi-state"
  ),
  "State_or_Provincial" =>
  array(
    "State or provincial",
    "Provincial or State",
    "Multi-state/Province",
    "Multi-State/Province/Territory",
    "Province",
    "Provincial or State government"
  ),
  "Regional" =>
  array(
    "Regional",
    "Regional District or County",
    "Regional government"
  ),
  "Federal" =>
  array(
    "Federal",
    "National government"
  ),
  "Special Purpose District" =>
  array(
    "Special Purpose District"
  ),
  "Intergovernmental" =>
  array(
    "International",
    "Multinational",
    "Intergovernmental/multi-agency organization"
  ),
  "Local" =>
  array(
    "Local",
    "Municipality",
    "Local government"
  ),
  "Non-Government Organizations" =>
  array(
    "Hybrid",
    "Non-governmental organization"
  ),
  "Researchers/Scientists" =>
  array(
    "Researchers or Scientists"
  ),
  "Business/Industry" =>
  array(
    "Business and Industry"
  ),
  "Multi-Stakeholders" =>
  array(
    "Multinational",
    "Intergovernmental/multi-agency organization"
  ),
  "Indigenous Nations" =>
  array(
    "Indigenous",
    "Tribal Council",
    "Indigenous Nation"
  )
);

?>
