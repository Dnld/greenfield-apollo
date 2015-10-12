'use strict';
 
var React = require('react-native');
var moment = require('moment');
var Button = require('apsl-react-native-button'); 
var screen = require('Dimensions').get('window');
 
var {
  StyleSheet,
  NavigatorIOS,
  Component, 
  View,
  Text,
  DatePickerIOS,
  TextInput,
  TouchableHighlight,
  AlertIOS,
  TouchableOpacity
} = React;

var BASE_URL = 'https://jupitrlegacy.herokuapp.com';
// var BASE_URL = 'http://localhost:8080';
var REQUEST_USER_HABITS_URL = BASE_URL + '/public/users/habits/';
var PUT_USER_HABIT_URL = BASE_URL + '/public/users/habits/';
 
var EditHabit = React.createClass ({
  getInitialState: function() {
    return {
      habitName: this.props.selectedHabit.habit.habitName,
      reminderTime: this.props.selectedHabit.habit.reminderTime,
      dueTime: this.props.selectedHabit.habit.dueTime
    }
  },

  // helper functions to set reminder and due time  
  subtractReminderTime: function(){
    this.setState({ reminderTime: moment(this.state.reminderTime).subtract(30, 'minutes') });
  },
  addReminderTime: function(){
    this.setState({ reminderTime: moment(this.state.reminderTime).add(30, 'minutes') });
  },
  subtractDueTime: function(){
    this.setState({ dueTime: moment(this.state.dueTime).subtract(30, 'minutes') });
  },
  addDueTime: function(){
    this.setState({ dueTime: moment(this.state.dueTime).add(30, 'minutes') });
  },
  
  putToServer: function(habit) {
    var url = PUT_USER_HABIT_URL + habit._id;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(habit)
    })
    .then((responseData) => {
      console.log(responseData);
    })
    .done();
  },
  
  updateHabit: function() {
    var habit = this.props.selectedHabit.habit;
    habit.reminderTime = moment(this.state.reminderTime).toISOString();
    habit.dueTime = moment(this.state.dueTime).toISOString();
    this.putToServer(habit);
    this.props.navigator.pop();
  },
  
  deactivateHabit: function() {
    var habit = this.props.selectedHabit.habit;
    var self = this
    AlertIOS.alert(
      'Deactivate Habit',
      'Do you want to deactivate this habit?',
      [
        {text: 'No', onPress: function() {
          return
        }},
        {text: 'Yes', onPress: function() {
          habit.active = false;
          self.putToServer(habit);
          self.props.navigator.pop();
        }},
      ]
    )
  },
  
  render: function(){
    return (
      <View style={[styles.container, styles.appBgColor]}>
        <Text style={styles.habitNameText}>{this.state.habitName.toUpperCase()}</Text>
        <Text style={styles.timeHeadingText}>Remind Me At</Text>
        <View style={styles.dateContainer}>
          <TouchableHighlight
            onPress={this.subtractReminderTime}
            underlayColor="transparent">
            <Text style={styles.selectorText}>-</Text>
          </TouchableHighlight>
          <Text style={styles.text}> { moment(this.state.reminderTime).format('hh:mm') + '\n' + moment(this.state.reminderTime).format('A') } </Text>
          <TouchableHighlight
            onPress={this.addReminderTime}
            underlayColor="transparent">
            <Text style={styles.selectorText}>+</Text>
          </TouchableHighlight>
        </View>     
        <Text style={styles.timeHeadingText}>Due At</Text>
        <View style={styles.dateContainer}>
          <TouchableHighlight
            onPress={this.subtractDueTime}
            underlayColor="transparent">
            <Text style={styles.selectorText}>-</Text>
          </TouchableHighlight>
          <Text style={styles.text}> { moment(this.state.dueTime).format('hh:mm') + '\n' + moment(this.state.dueTime).format('A') } </Text>
          <TouchableHighlight
            onPress={this.addDueTime}
            underlayColor="transparent">
            <Text style={styles.selectorText}>+</Text>
          </TouchableHighlight>
        </View>
        <View style={{marginTop: 20}}>
          <TouchableOpacity style={styles.updateHabit} onPress={this.updateHabit}>
            <Text style={styles.updateHabitText}>
              Update Habit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateHabit} onPress={this.updateHabit}>
            <Text style={[styles.updateHabitText, {fontSize: 18, color: 'rgba(200, 200, 200, 0.5)'}]}>
              Deactivate Habit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
    color: 'rgb(180, 180, 180)',
  },
  timeHeadingText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 25,
    color: 'c69037',
  },
  selectorText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
    color: '8db063',
  },
  habitNameText: {
    fontSize: 30,
    marginBottom: 10,
    color: 'rgb(200, 200, 200)'
  },
  // buttonText: {
  //   color: 'white',
  // },
  // updateButton: {
  //   backgroundColor: '3498db',
  //   marginTop: 30,
  //   marginBottom: 15,
  //   marginLeft: 50,
  //   marginRight: 50,
  // },
  deactivateButton: {
    backgroundColor: '#DB575F',
    marginLeft: 50,
    marginRight: 50,
  },
  updateHabit: {  
    width: 250,
    textAlign: 'center',
    margin: 5
  },
  updateHabitText: {
    fontSize: 25,
    color: 'fe4b66',
    textAlign: 'center'
  },
  appBgColor: {
    backgroundColor: 'rgba(0, 15, 40, 0.9)'
  },
});

// <Button style={styles.updateButton}
//   textStyle={styles.buttonText}
//   onPress={this.updateHabit}>
//   Update Habit
// </Button> 

// <Button style={styles.deactivateButton}
//   textStyle={styles.buttonText}
//   onPress={this.deactivateHabit}>
//   Deactivate Habit
// </Button> 

module.exports = EditHabit;
