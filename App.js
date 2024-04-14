import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Announcement Component
const Announcement = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Clinic Integration Database Inventory</Text>
      <View style={styles.separator} />
      <Text style={styles.sectionHeader}>Announcements</Text>
      {/* Add latest announcements here */}
      <Text>Stay Healthy!</Text>
      <Text>Hydrate!</Text>
    </View>
  );
};

// Illnesses Component
const Illnesses = ({ onSelectIllness }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredIllnesses, setFilteredIllnesses] = useState([]);


  // List of illnesses
  const illnesses = [
    { name: 'Flu', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'COVID-19', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Pertussis / Whooping Cough', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Hypertension', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Dysmenorrhea', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Cough', description: 'A cough is a common reflex action that clears the throat of mucus or foreign irritants.', medicine: 'Cough syrup, Honey and lemon, etc.', image: require('./assets/cough.jpg'), symptoms: [{ name: 'Persistent cough', severity: 'Moderate' }, { name: 'Shortness of breath', severity: 'Severe' }, { name: 'Sore throat', severity: 'Mild' }] },
    { name: 'Diarrhea', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Allergies', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Stomach Ache', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Headache', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Sore Eyes', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Sore Throat', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Urinary Track Infection', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Heat Stroke', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Heat Exhaustion', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Animal Bites', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Asthma', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Chickenpox', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Food Poisoning', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Hyperthermia', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Mumps', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Rabies', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Dengue', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Typhoid Fever', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Tuberculosis', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Hand, Foot and Mouth Disease', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Tetanus', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    { name: 'Leptospirosis', description: 'Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.', medicine: 'BioFlu, Drink Water, etc.', image: require('./assets/flu.jpg'), symptoms: [{ name: 'Fever', severity: 'Moderate' }, { name: 'Cough', severity: 'Severe' }, { name: 'Fatigue', severity: 'Mild' }] },
    // Add more illnesses here
  ];


  // Function to filter illnesses based on search text
  const handleSearch = () => {
    const filtered = illnesses.filter(illness => illness.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredIllnesses(filtered);
  };

  // If no search text, display all illnesses
  const displayIllnesses = searchText === '' ? illnesses : filteredIllnesses;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Illnesses</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Illness"
        value={searchText}
        onChangeText={text => setSearchText(text)}
        onSubmitEditing={handleSearch}
      />
      {displayIllnesses.map((illness, index) => (
        <View key={index}>
          <TouchableOpacity onPress={() => onSelectIllness(illness)}>
            <Text style={styles.illnessButton}>{illness.name}</Text>
          </TouchableOpacity>
          {index !== displayIllnesses.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
};

// Illness Details Component
const IllnessDetails = ({ illness, onBack, getColorForSeverity }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Illness Details</Text>
      <Text style={styles.hospitalName}>{illness.name}</Text>
      <Image source={illness.image} style={styles.illnessImage} />
      <Text style={styles.detailHeader}>Description:</Text>
      <Text>{illness.description}</Text>
      <Text style={styles.detailHeader}>Symptoms:</Text>
      {illness.symptoms ? (
        <View>
          {illness.symptoms.map((symptom, index) => (
            <Text key={index} style={{ color: getColorForSeverity(symptom.severity) }}>
              {symptom.name} - {symptom.severity}
            </Text>
          ))}
        </View>
      ) : (
        <Text>No symptoms found.</Text>
      )}
      <Text style={styles.detailHeader}>Medicines:</Text>
      <Text>{illness.medicine}</Text>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backButton}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// Health Resources Component
const HealthResources = ({ onSelectHospital }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  // List of hospitals
  const hospitals = [
    { name: 'Corazon C. Aquino Hospital', location: 'Circumferential Road, Biasong, Dipolog', hotline: '(065) 212 5555', distance: '19 KM. ~28 Minutes', image: require('./assets/corazon.jpg'), details: { rating: 4.4, openHours: '24/7', services: ['Dermatology', 'Dentistry', 'Urology'], socialMedia: 'none' } },
    { name: 'Ace Medical Center Dipolog', location: 'Barangay Olingan, Dipolog', hotline: '0975-931-1016', distance: 'Around 12.7 KM. ~16 Minutes', image: require('./assets/flu.jpg'), details: { rating: 4.5, openHours: '24/7', services: ['Pediatrics', 'Pediatrics', 'Physical Therapy'], socialMedia: '@AceMCDipolog' } },
    { name: 'Zamboanga del Norte Medical Center', location: 'Barangay Sicayab, Dipolog', hotline: '(065) 212 3333', distance: '30 KM. ~30 Minutes', image: require('./assets/flu.jpg'), details: { rating: 3.6, openHours: 'No Info', services: ['Dermatology', 'Ophthalmology', 'Dentistry'], socialMedia: 'none' } },
    { name: 'Zamboanga del Norte Service Cooperative Hospital', location: 'Turno, Dipolog', hotline: '(065) 212 2444, 0918-920-4392', distance: 'Around 16 KM. ~25 Minutes', image: require('./assets/flu.jpg'), details: { rating: 3, openHours: '24/7', services: ['No Info'], socialMedia: '@znservicecoophospital' } },
    { name: 'Agape Health Care Center', location: 'Herrera corner, Claudio Streets, Dipolog', hotline: '(065) 212 7055', distance: 'Around 18 KM. ~27 Minutes', image: require('./assets/flu.jpg'), details: { rating: 3.9, openHours: '6am to 6pm Monday to Saturday, Closed on Sundays', services: ['Medical Laboratory Services', 'Urinalysis', 'CBC'], socialMedia: '@TheAGAPEHealthCareCenter' } },
    { name: 'Ospital ng Kabataan ng Dipolog, Inc.', location: 'Padre Ramon St., Estaka, Dipolog', hotline: '0977-806-1449, ER: 0977-644-8304', distance: 'Around 18 KM. ~28 Minutes', image: require('./assets/flu.jpg'), details: { rating: 2.9, openHours: 'No Info', services: ['Emergency', 'Pharmacy', 'Dialysis'], socialMedia: '@OspitalNgKabataan' } },
    { name: 'Health Hub Ambulatory and Surgical Center', location: 'National Highway Sta. Filomena, Dipolog', hotline: '(065) 908 2308, 0970-038-8444', distance: 'Around 15 KM. ~21 Minutes', image: require('./assets/flu.jpg'), details: { rating: 4.8, openHours: 'No Info', services: ['Medical Laboratory', 'Pharmacy', 'ECG'], socialMedia: '@HealthHub' } },
    // Add more hospitals here
  ];  

  // Function to filter hospitals based on search text
  const handleSearch = () => {
    const filtered = hospitals.filter(hospital => hospital.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredHospitals(filtered);
  };

  // If no search text, display all hospitals
  const displayHospitals = searchText === '' ? hospitals : filteredHospitals;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Health Resources</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Hospital"
        value={searchText}
        onChangeText={text => setSearchText(text)}
        onSubmitEditing={handleSearch}
      />
      {displayHospitals.map((hospital, index) => (
        <TouchableOpacity key={index} onPress={() => onSelectHospital(hospital)}>
          <View>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text>Location: {hospital.location}</Text>
            <Text>Hotline: {hospital.hotline}</Text>
            <Text>Distance from School: {hospital.distance}</Text>
            {index !== displayHospitals.length - 1 && <View style={styles.separator} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Hospital Details Component
const HospitalDetails = ({ hospital, onBack }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < hospital.details.rating; i++) {
      stars.push(<MaterialCommunityIcons key={i} name="star" size={20} color="gold" />);
    }
    return stars;
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Hospital Details</Text>
      <Text style={styles.hospitalName}>{hospital.name}</Text>
      <View style={styles.ratingContainer}>
        {renderStars()}
      </View>
      <Image source={hospital.image} style={styles.hospitalImage} />
      <Text style={styles.detailHeader}>Location:</Text>
      <Text>{hospital.location}</Text>
      <Text style={styles.detailHeader}>Hotline:</Text>
      <Text>{hospital.hotline}</Text>
      <Text style={styles.detailHeader}>Open and Close Times:</Text>
      <Text>{hospital.details.openHours}</Text>
      <Text style={styles.detailHeader}>Distance from School:</Text>
      <Text>{hospital.distance}</Text>
      <Text style={styles.detailHeader}>Services Offered:</Text>
      {hospital.details.services.map((service, index) => (
        <Text key={index}>{service}</Text>
      ))}
      <Text style={styles.detailHeader}>Social Media to Contact:</Text>
      <Text>{hospital.details.socialMedia}</Text>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backButton}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};


const PersonalizedHealth = () => {
  // State variables for menstrual cycle tracker
  const [lastMenstrualDate, setLastMenstrualDate] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [nextMenstrualDate, setNextMenstrualDate] = useState('');

  // Function to calculate next menstrual date
  const calculateNextMenstrualDate = () => {
    // Convert last menstrual date to date object
    const lastDate = new Date(lastMenstrualDate);
    // Add cycle length to last menstrual date
    const nextDate = new Date(lastDate.getTime() + (parseInt(cycleLength) * 24 * 60 * 60 * 1000));
    // Update state with next menstrual date
    setNextMenstrualDate(nextDate.toDateString());
  };

  // State variables for BMI calculator
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(null);

  // Function to calculate BMI
  const calculateBMI = () => {
    // Convert height to meters
    const heightInMeters = parseFloat(height) / 100;
    // Calculate BMI
    const calculatedBMI = parseFloat(weight) / (heightInMeters * heightInMeters);
    // Update state with BMI
    setBMI(calculatedBMI.toFixed(2));
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Personalized Health</Text>
      
      {/* Menstrual Cycle Tracker */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Menstrual Cycle Tracker</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Last Menstrual Date (YYYY-MM-DD)"
          value={lastMenstrualDate}
          onChangeText={text => setLastMenstrualDate(text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Cycle Length (Days)"
          value={cycleLength}
          onChangeText={text => setCycleLength(text)}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={calculateNextMenstrualDate}>
          <Text style={styles.illnessButton}>Calculate Next Menstrual Date</Text>
        </TouchableOpacity>
        {nextMenstrualDate ? (
          <Text style={{ marginTop: 10 }}>Next Menstrual Date: {nextMenstrualDate}</Text>
        ) : null}
      </View>
      
      {/* BMI Calculator */}
      <View>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>BMI Calculator</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Height (cm)"
          value={height}
          onChangeText={text => setHeight(text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={text => setWeight(text)}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={calculateBMI}>
          <Text style={styles.illnessButton}>Calculate BMI</Text>
        </TouchableOpacity>
        {bmi !== null ? (
          <View>
            <Text style={{ marginTop: 10 }}>Your BMI: {bmi}</Text>
            <Text style={[styles.category, { color: bmi < 18.5 ? 'red' : bmi >= 18.5 && bmi < 24.9 ? 'green' : 'red' }]}>
              Category: {bmi < 18.5 ? 'Underweight' : bmi >= 18.5 && bmi < 24.9 ? 'Normal weight' : 'Overweight'}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const AboutApp = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>About the App</Text>
      <Text style={styles.sectionContent}>
        This app provides health information including announcements, details about various illnesses, resources for finding hospitals, and personalize health track.
      </Text>

      {/* About the Team */}
      <Text style={[styles.sectionHeader, { marginTop: 20 }]}>About the Team</Text>

      {/* Team Member 1 */}
      <View style={styles.teamMemberContainer}>
        <Image source={require('./assets/grisby.jpg')} style={styles.profileImage} />
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>Grisby Tangaran</Text>
          <Text style={styles.memberPosition}>Cool Dude</Text>
          {/* Add more details about the team member if needed */}
        </View>
      </View>

      {/* Team Member 2 */}
      <View style={styles.teamMemberContainer}>
        <Image source={require('./assets/anthony.jpg')} style={styles.profileImage} />
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>Anthony Moran</Text>
          <Text style={styles.memberPosition}>Cool Boi</Text>
          {/* Add more details about the team member if needed */}
        </View>
      </View>

      {/* Team Member 3 */}
      <View style={styles.teamMemberContainer}>
        <Image source={require('./assets/paola.jpg')} style={styles.profileImage} />
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>Paola Briones</Text>
          <Text style={styles.memberPosition}>Gorl</Text>
          {/* Add more details about the team member if needed */}
        </View>
      </View>

      {/* Team Member 4 */}
      <View style={styles.teamMemberContainer}>
        <Image source={require('./assets/bea.jpg')} style={styles.profileImage} />
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>Bea Afaga</Text>
          <Text style={styles.memberPosition}>Gorl</Text>
          {/* Add more details about the team member if needed */}
        </View>
      </View>
      
      {/* Team Member 5 */}
      <View style={styles.teamMemberContainer}>
        <Image source={require('./assets/mayumi.jpg')} style={styles.profileImage} />
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>Mayumi Macute</Text>
          <Text style={styles.memberPosition}>Gorl</Text>
          {/* Add more details about the team member if needed */}
        </View>
      </View>

      {/* Add more team members as needed */}
    </View>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState('Announcement');
  const [selectedIllness, setSelectedIllness] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Function to get color based on severity
  const getColorForSeverity = (severity) => {
    switch (severity) {
      case 'Mild':
        return '#008000'; // Green
      case 'Moderate':
        return '#FFFF00'; // Yellow
      case 'Severe':
        return '#FF0000'; // Red
      default:
        return '#000000'; // Black
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Announcement':
        return <Announcement />;
      case 'Illnesses':
        return selectedIllness ? <IllnessDetails illness={selectedIllness} onBack={() => setSelectedIllness(null)} getColorForSeverity={getColorForSeverity} /> : <Illnesses onSelectIllness={illness => setSelectedIllness(illness)} />;
      case 'HealthResources':
        return selectedHospital ? <HospitalDetails hospital={selectedHospital} onBack={() => setSelectedHospital(null)} /> : <HealthResources onSelectHospital={hospital => setSelectedHospital(hospital)} />;
      case 'PersonalizedHealth':
        return <PersonalizedHealth />;
      case 'AboutApp':
          return <AboutApp />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderSection()}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setActiveSection('Announcement')}>
          <MaterialCommunityIcons name="bell" size={30} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveSection('Illnesses')}>
          <MaterialCommunityIcons name="hospital" size={30} color="#28a745" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveSection('HealthResources')}>
          <MaterialCommunityIcons name="hospital-building" size={30} color="#dc3545" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveSection('PersonalizedHealth')}>
          <MaterialCommunityIcons name="heart-pulse" size={30} color="#6610f2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveSection('AboutApp')}>
          <MaterialCommunityIcons name="information" size={30} color="#ffc107" />
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  illnessButton: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007bff',
  },
  illnessName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hospitalName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  backButton: {
    color: '#007bff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  illnessImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  hospitalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  detailHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    marginTop: 10,
  },
  teamMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  memberDetails: {
    marginLeft: 20,
  },
  memberName: {
    fontWeight: 'bold',
  },
  memberPosition: {
    color: '#888',
  },
});
