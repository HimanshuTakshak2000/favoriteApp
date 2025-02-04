import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';

const API_URL = 'https://reqres.in/api/users?page=2';

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

const HomeScreen = () => {
  const [data, setData] = useState<User[]>([]);
  const [favorites, setFavorites] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();
        setData(json.data);
        setLoading(false);

        const savedFavorites = await AsyncStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [isFocused]);

  const toggleFavorite = async (item: User) => {
    try {
      let updatedFavorites = [...favorites];
      const index = updatedFavorites.findIndex(
        (fav: User) => fav.id === item.id,
      );

      if (index !== -1) {
        updatedFavorites.splice(index, 1);
      } else {
        updatedFavorites.push(item);
      }

      setFavorites(updatedFavorites);

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const renderItem = ({item}: {item: User}) => {
    const isFavorite = favorites.some((fav: User) => fav.id === item.id);

    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          borderBottomWidth: 1,
        }}>
        <Image
          source={{uri: item.avatar}}
          style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
        />
        <Text style={{flex: 1}}>
          {item.first_name} {item.last_name}
        </Text>
        <TouchableOpacity onPress={() => toggleFavorite(item)}>
          <Icon
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color={isFavorite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading)
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );

  return (
    <View style={{flex: 1, padding: 10}}>
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>Items List</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default HomeScreen;
