import React from 'react';
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, StyleSheet, Share
} from 'react-native';
import { colors, shared } from '../styles';

const confidenceColor = {
  High: '#2a6b3c',
  Medium: '#b7860b',
  Low: '#c0392b',
};

export default function ResultScreen({ route, navigation }) {
  const { result, imageUri, location } = route.params;

  const shareResult = async () => {
    await Share.share({
      message:
        `⛪ Irish Church Analysis\n\n` +
        `Period: ${result.period}\n` +
        `Date Range: ${result.date_range}\n` +
        `Confidence: ${result.confidence}\n\n` +
        `${result.summary}\n\n` +
        `Key Features:\n` +
        result.features.map(f => `• ${f}`).join('\n'),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <View style={[shared.card, styles.badgeCard]}>
        <Text style={styles.periodLabel}>Identified Period</Text>
        <Text style={styles.period}>{result.period}</Text>
        <Text style={styles.dateRange}>{result.date_range}</Text>
        <View style={[
          styles.confidenceBadge,
          { backgroundColor: confidenceColor[result.confidence] || colors.subtext }
        ]}>
          <Text style={styles.confidenceText}>
            {result.confidence} Confidence
          </Text>
        </View>
      </View>

      <View style={shared.card}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.bodyText}>{result.summary}</Text>
      </View>

      <View style={shared.card}>
        <Text style={styles.sectionTitle}>Key Architectural Features</Text>
        {result.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {location && (
        <TouchableOpacity
          style={[shared.button, styles.actionBtn]}
          onPress={() => navigation.navigate('Map', { location, result })}
        >
          <Text style={shared.buttonText}>📍 View on Map</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[shared.secondaryButton, styles.actionBtn]}
        onPress={shareResult}
      >
        <Text style={shared.buttonText}>📤 Share Result</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.outlineBtn, styles.actionBtn]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.outlineBtnText}>← Analyse Another</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: 50,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 16,
  },
  badgeCard: {
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 13,
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  period: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
  },
  dateRange: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 4,
    marginBottom: 12,
  },
  confidenceBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  featureBullet: {
    color: colors.primary,
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    lineHeight: 20,
  },
  actionBtn: {
    width: '100%',
    marginBottom: 12,
  },
  outlineBtn: {
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  outlineBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
});
