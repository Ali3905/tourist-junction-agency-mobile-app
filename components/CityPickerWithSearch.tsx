import React, { useState, useEffect } from 'react';
import { TextInput, View, FlatList, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc'; // Tailwind for styling
import { City } from 'country-state-city'; // Import City from country-state-city

// Define types for the props
interface CityPickerWithSearchProps {
  selectedCity: string; // The selected city
  setSelectedCity: (cityName: string) => void; // Function to set the selected city
  placeholder: string; // Placeholder text for the search input
}

const CityPickerWithSearch: React.FC<CityPickerWithSearchProps> = ({ selectedCity, setSelectedCity, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for the search term
  const [cityList, setCityList] = useState<City[]>([]); // List of cities to display
  const [filteredCities, setFilteredCities] = useState<City[]>([]); // Filtered list based on search term
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false); // State to manage suggestions visibility

  useEffect(() => {
    // Fetch all cities of India
    const cities = City.getCitiesOfCountry('IN'); // Assuming 'IN' is the country code for India
    setCityList(cities);
  }, []);

  useEffect(() => {
    // Filter cities based on search term
    if (searchTerm.length > 0) {
      setFilteredCities(
        cityList.filter((city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCities([]);
    }
  }, [searchTerm, cityList]);

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
    setSearchTerm(cityName); // Set the search term to the selected city name
    setShowSuggestions(false); // Hide suggestions after selecting a city
  };

  const handleFocus = () => {
    setShowSuggestions(true); // Show suggestions when the input is focused
  };

  const handleBlur = () => {
    if (searchTerm === '') {
      setShowSuggestions(false); // Hide suggestions when input loses focus if no term is entered
    }
  };

  return (
    <View style={tw` bg-white  border-gray-200 p-1 `}>
      {/* Search Input */}
      <TextInput
        style={tw`border border-gray-200 h-10 px-2 rounded-md`}
        placeholder={placeholder} // Placeholder is now set via prop
        value={searchTerm} // Display the search term or the selected city
        onChangeText={setSearchTerm}
        onFocus={handleFocus} // Show suggestions on focus
        onBlur={handleBlur} // Hide suggestions when the user leaves the input
      />

      {/* City Options List */}
      {showSuggestions && (
        <FlatList
          style={tw`bg-white  rounded-lg mt-1 max-h-60`}
          data={filteredCities}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectCity(item.name)}>
              <Text style={tw`p-2`}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default CityPickerWithSearch;
