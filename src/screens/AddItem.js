import React, {Component} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import moment from 'moment';

import global from '../styles/global';

const initialState = {desc: ''};

export default class AddItem extends Component {
  state = {
    ...initialState,
  };

  handleSave = () => {
    const newItem = {
      desc: this.state.desc,
    };
    // Somente executa se existir o métodos
    // como se fosse um if com a execução dentro
    this.props.onSave && this.props.onSave(newItem);
    this.setState({...initialState});
  };

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.isVisible}
        onRequestClose={this.props.onCancel}
        animationType="slide">
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text style={styles.header}>Novo Item </Text>
          <TextInput
            style={styles.input}
            placeholder="Informe a Descrição"
            onChangeText={desc => this.setState({desc})}
            value={this.state.desc}
          />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={this.props.onCancel}>
              <Text style={styles.button}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleSave}>
              <Text style={styles.button}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: '#FFF',
  },
  header: {
    fontFamily: global.colors.fontFamily,
    backgroundColor: global.colors.primary,
    color: global.colors.secondary,
    textAlign: 'center',
    padding: 15,
    fontSize: 18,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    fontFamily: global.fontFamily,
    height: 40,
    margin: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 6,
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: 'black',
  },
});
