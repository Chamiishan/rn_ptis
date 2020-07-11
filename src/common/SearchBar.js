import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import search from '../Component/assets/search.png';
import * as Animate from 'react-native-animatable';
const listItems = [
  'Writing',
  'Larning',
  'Descipling',
  'Productivity',
  'Personal',
  'Meditate',
  'Mindfulness',
  'Buddha',
  'Dhamma',
  'Health',
  'Fitness',
  'Music',
];

class SearchBar extends React.Component {
  state = {
    searchBarFocused: false,
  };
  componentDidMount() {
    this.keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow
    );
    this.keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide
    );
  }

  keyboardDidShow = () => {
    this.setState({ searchBarFocused: true });
  };

  keyboardWillShow = () => {
    this.setState({ searchBarFocused: true });
  };

  keyboardWillHide = () => {
    this.setState({ searchBarFocused: false });
  };
  render() {
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <View
          style={{
            height: 80,
            backgroundColor: '#fff',
            justifyContent: 'center',
            paddingHorizontal: 0,
          }}>
          {/* <Animate.View
            animation="slideInRight"
            duration={1000}
            style={{
              height: 50,
              backgroundColor: 'white',
              flexDirection: 'row',
              padding: 5,
              alignItems: 'center',
            }}>*/}
            <Icon
              name={
                  search
                // this.state.searchBarFocused ? search : search
              }
              style={{ fontSize: 20 }}
            /> 
            <TextInput
              placeholder="Search"
              style={{ fontSize: 20, paddingLeft: 15 }}
            />
          {/* </Animate.View> */}
        </View>
        {/* <FlatList
          style={{
            backgroundColor: this.state.searchBarFocused
              ? 'rgba(0,0,0,0.3)'
              : 'white',
          }}
          data={listItems}
          renderItem={({ item }) => (
            <Text style={{ padding: 20, fontSize: 20 }}>{item}</Text>
          )}
          keyExtractor={(item, index) => index.toString()}
        /> */}
      </View>
    );
  }
}

export {SearchBar};
