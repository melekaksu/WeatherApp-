import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const API_KEY = '811b02ca457143168874049d97e720fd';
const cities = ['Erzurum', 'Ankara', 'Adana', 'Samsun', 'İzmir', 'İstanbul'];

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const promises = cities.map(city =>
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Hata: ${response.statusText}`);
              }
              return response.json();
            })
        );

        const results = await Promise.all(promises);
        setWeatherData(results);
        setLoading(false);
      } catch (error) {
        console.error('Hava durumu verileri alınırken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      {weatherData.map((cityData, index) => (
        <View key={index} style={styles.cityContainer}>
          <Text style={styles.cityName}>{cityData?.name || 'Bilinmeyen Şehir'}</Text>
          <Text style={styles.temperature}>
            {cityData?.main?.temp ? `${Math.round(cityData.main.temp)}°C` : 'Veri yok'}
          </Text>
          <Text style={styles.description}>
            {cityData?.weather?.[0]?.description || 'Açıklama yok'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa', 
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
  cityContainer: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
    borderLeftWidth: 6,
    borderLeftColor: '#0288d1',
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0288d1',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#ff7043',
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#757575',
  },
});

export default WeatherApp;
