import {View, Text, FlatList, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {User} from './HomeScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';

const FavoriteScreen = () => {
  const [favorites, setFavorites] = useState<User[]>([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    const loadFavorites = async () => {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    };
    loadFavorites();
  }, [isFocused]);

  const renderItem = ({item}: {item: User}) => (
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

      <View>
        <Icon name={'favorite'} size={24} color={'red'} />
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, padding: 10}}>
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>Favorite Items</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
export default FavoriteScreen;
