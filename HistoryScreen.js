import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { colors, shared } from '../styles';

const API_URL = '[192.168.1.11](http://192.168.1.11:8000)';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to load history', error);
    }
  };

  // Refresh every time screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const confirmDelete = (id) => {
    Alert.alert('Delete', 'Remove this entry from history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await axios.delete(`${API_URL}/history/${id}`);
          fetchHistory();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[shared.card, styles.item]}
      onPress={() =>
        navigation.navigate('Result', {
          result: {
            period: item.period,
            date_range: item.date_range,
            confidence: item.confidence,
            features: item.features,
            summary: item.full_result
              ? JSON.parse(item.full_result).summary
              : '',
          },
          imageUri: null,
          location:
            item.latitude
              ? { latitude: item.latitude, longitude: item.longitude }
              : null,
        })
      }
    >
      <View style={styles.itemContent}>
        {item.image_path ? (
          <Image
            source={{ uri: `${API_URL}/${item.image_path}` }}
            style={styles.thumbnail}
          />
        ) : (
          <View style={[styles.thumbnail, styles.noImage]}>
            <Text>⛪</Text>
          </View>
        )}
        <View style={styles.itemText}>
          <Text style={styles.itemPeriod}>{item.period}</Text>
          <Text style={styles.itemDate}>{item.date_range}</Text>
          <Text style={styles.itemTimestamp}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => confirmDelete(item.id)}
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={shared.screen}>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>⛪</Text>
          <Text style={styles.emptyLabel}>No analyses yet</Text>
          <Text style={styles.emptySubLabel}>
            Photograph a church to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingTop: 20,
  },
  item: {
    marginBottom: 12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
  },
  noImage: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemPeriod: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  itemDate: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 2,
  },
  itemTimestamp: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: {
    fontSize: 18,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubLabel: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 6,
  },
});
