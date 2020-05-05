import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import 'moment/locale/pt-br';

import Icon from 'react-native-vector-icons/FontAwesome';

import global from '../styles/global';
import marketImage from '../../assets/imgs/market.jpg';
import Item from '../components/Item';
import AddItem from './AddItem';

const initialState = {
  showDoneItems: true,
  showAddItem: false,
  visibleItems: [],
  items: [],
};

export default class TaksList extends Component {
  state = {
    ...initialState,
  };

  componentDidMount = async () => {
    const stateString = await AsyncStorage.getItem('items');
    const state = JSON.parse(stateString) || initialState;
    this.setState(state, this.filterItems);
  };

  toggleFilter = () => {
    this.setState({showDoneItems: !this.state.showDoneItems}, this.filterItems);
  };

  filterItems = () => {
    let visibleItems = null;

    if (this.state.showDoneItems) {
      visibleItems = [...this.state.items];
    } else {
      const pending = items => items.doneAt === null;
      visibleItems = this.state.items.filter(pending);
    }
    this.setState({visibleItems});
    AsyncStorage.setItem('items', JSON.stringify(this.state));
  };

  toggleItem = itemId => {
    const items = [...this.state.items];
    items.forEach(item => {
      if (item.id === itemId) {
        item.doneAt = item.doneAt ? null : new Date();
      }
    });

    this.setState({items}, this.filterItems);
  };

  addItem = newItem => {
    if (!newItem.desc || !newItem.desc.trim()) {
      Alert.alert('Dados inválidos', 'Descrição precisa ser informada');
      return;
    }

    const items = [...this.state.items];
    items.push({
      id: Math.random(),
      desc: newItem.desc,
      doneAt: null,
    });

    this.setState({items, showAddItem: false}, this.filterItems);
  };

  deleteItem = id => {
    const items = this.state.items.filter(item => item.id !== id);
    this.setState({items}, this.filterItems);
  };

  render() {
    return (
      <View style={styles.container}>
        <AddItem
          isVisible={this.state.showAddItem}
          onCancel={() => this.setState({showAddItem: false})}
          onSave={this.addItem}
        />
        <ImageBackground source={marketImage} style={styles.background} />
        <View style={styles.itemList}>
          <FlatList
            data={this.state.visibleItems}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => (
              <Item
                {...item}
                onToggleItem={this.toggleItem}
                onDelete={this.deleteItem}
              />
            )}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={this.toggleFilter}>
          <Icon
            name={this.state.showDoneItems ? 'eye' : 'eye-slash'}
            size={20}
            color={global.colors.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => this.setState({showAddItem: true})}>
          <Icon name="plus" size={20} color={global.colors.secondary} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  itemList: {
    flex: 7,
  },
  filterButton: {
    position: 'absolute',
    left: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: global.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: global.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
