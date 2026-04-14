import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { colors } from '../styles';

export default function MapScreen({ route }) {
  const { location, result } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={result.period}
          description={result.date_range}
        >
          <Callout>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>{result.period}</Text>
              <Text style={styles.calloutDate}>{result.date_range}</Text>
              <Text style={styles.calloutConf}>
                Confidence: {result.confidence}
              </Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  callout: {
    width: 180,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.text,
  },
  calloutDate: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 2,
  },
  calloutConf: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 4,
  },
});
