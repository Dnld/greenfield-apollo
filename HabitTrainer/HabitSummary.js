'use strict';

var React = require('react-native');
var helpers = require('./helper/helpers.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var PageControl = require('react-native-page-control');
var screen = require('Dimensions').get('window');

var {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Component,
  PixelRatio,
  NavigatorIOS,
  TouchableOpacity,
  Image,
  NativeModules: {
    UIImagePickerManager
  }
} = React;

var HABITS = [
  {habitName: 'Submit a Pull Request', streak: 5, checkinCount: 25, failedCount: 3, reminderTime: '2:30 PM', dueTime: '4:30 PM', streakRecord: 15, active:true},
  {habitName: 'Complete a Pomodoro', streak: 10, checkinCount: 20, failedCount: 4, reminderTime: '2:30 PM', dueTime: '8:30 PM', streakRecord: 20, active:true},
  {habitName: 'Workout', streak: 8, checkinCount: 15, failedCount: 2, reminderTime: '2:30 PM', dueTime: '4:30 PM', streakRecord: 8, active:true}
];

var USER = {
  name: 'Pied Piper',
  dateJoined: '10/06/15',
  points: 420
}

var REQUEST_USER_HABITS_URL = 'https://jupitrlegacy.herokuapp.com/public/users/habits';

var HabitSummary = React.createClass ({
  getInitialState: function(){
    console.log(this.props.userHabits);
    return {
      avatarSource: null,
      userName: 'Public User',
      userHabits: null
    };
  },

  fetchUserHabits: function() {
    fetch(REQUEST_USER_HABITS_URL)
      .then((response) => response.json())
      .then((responseData) => {
        console.log('_______________user habits fetched from server______________');
        this.setState({
          userHabits: responseData
        });
        console.log(this.state.userHabits);
        this._processHabits(this.state.userHabits.habits);  
      })
      .done();
  },

  _processHabits: function(habits) {
    var next = helpers.nextHabit(habits);
    var diff = next[2];
    var dueTime = next[1];
    var nextHabitHolder = next[0];
    var nextWidthHolder = helpers.mapToDomain([0, dueTime],[0, 250], diff, true);
    this.setState({nextHabit: nextHabitHolder, nextWidth: nextWidthHolder});
    this._interval = window.setInterval(this.onTick, 60000);
  },

  componentDidMount: function() {
    this.fetchUserHabits();
  },

  componentWillUnmount: function() {
    window.clearInterval(this._interval);
  },

  avatarTapped: function() {
  // Specify any or all of these keys
    var options = {
      title: 'Select Avatar',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      takePhotoButtonHidden: false,
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      chooseFromLibraryButtonHidden: false,
      returnBase64Image: false,
      returnIsVertical: false,
      quality: 0.2
    };
    UIImagePickerManager.showImagePicker(options, (responseType, response) => {
      console.log(`Response Type = ${responseType}`);

      if (responseType !== 'cancel') {
        var source;
        if (responseType === 'data') { // New photo taken OR passed returnBase64Image true -  response is the 64 bit encoded image data string
          source = {uri: 'data:image/jpeg;base64,' + response, isStatic: true};
        } else { // Selected from library - response is the URI to the local file asset
          source = {uri: response.replace('file://', ''), isStatic: true};
        }

        this.setState({
          avatarSource: source
        });
      }
    });
  },

  onTick: function() {
    this._processHabits(this.state.userHabits.habits);
  },

  onScroll: function(event){
    var offsetX = event.nativeEvent.contentOffset.x,
        pageWidth = screen.width - 10;
    this.setState({
      currentPage: Math.floor((offsetX - pageWidth / 2) / pageWidth) + 1
    });
  },

  render: function(){
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={this.avatarTapped}>
            <View style={styles.icon}>
            { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
              <Image style={styles.icon} source={this.state.avatarSource} />
            }
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.content}>
              Hello, {USER.name}! 
            </Text>
            <Text style={styles.contentSmall}>
              Training since {USER.dateJoined}
            </Text>
          </View>
        </View>
        <View style={{backgroundColor:'red', width:screen.width,height: 250}}>
          <ScrollView 
            ref="ad" 
            pagingEnabled={true} 
            horizontal={true} 
            showsHorizontalScrollIndicator={false} 
            bounces={false} 
            onScroll={this.onScroll} 
            scrollEventThrottle={16} 
            style={{height: 250, borderWidth: 1, backgroundColor: 'grey'}}>
            <View style={{width:screen.width,  height:164}}>
              <View style={styles.pointsCir}>
                <Text style={styles.points}>
                  {USER.points}
                </Text>
              </View>
            </View>
            <View style={{width:screen.width,  height:164}}>
              <View style={styles.pointsCir}>
                <Text style={styles.points}>
                  another one
                </Text>
              </View>
            </View>
            <View style={{width:screen.width,  height:164}}>
              <View style={styles.pointsCir}>
                <Text style={styles.points}>
                  third one
                </Text>
              </View>
            </View>
          </ScrollView>
          <PageControl 
            style={{position:'absolute', left:0, right:0, bottom:10}} 
            numberOfPages={3} 
            currentPage={this.state.currentPage} 
            hidesForSinglePage={true} 
            pageIndicatorTintColor='gray' 
            indicatorSize={{width:8, height:8}} 
            currentPageIndicatorTintColor='black' />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.content}>
            Next Up
          </Text>
        </View>
        <View>
          <View style={[styles.overlay,{width: this.state.nextWidth}]}>
          </View>
          <Text style={styles.next}>
            {this.state.nextHabit}
          </Text>
        </View>
      </View>
    );
  }
});

var test = 50;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    // borderWidth: 1,
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  contentSmall: {
    // borderWidth: 1,
    fontSize: 12,
    textAlign: 'center',
    margin: 10,
  },
  icon: {
    width: 75,
    height: 75,
    borderWidth: 1 / PixelRatio.get(),
  },
  next: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
    width: 250,
    height: 39,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  pointsCir: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 10, 0, 0.2)'
  },
  points: {
    fontSize: 50,
    textAlign: 'center',
  }, 
  overlay: {
    top: 0, 
    position: 'absolute', 
    padding: 10, 
    height: 39, 
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 0, 0.9)'
  }
});

AppRegistry.registerComponent('HabitSummary', () => HabitSummary);

module.exports = HabitSummary;
