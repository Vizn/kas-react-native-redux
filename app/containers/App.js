import React, { Component } from 'react';
import { AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  ListView,
  Navigator,
  TouchableOpacity,
  ToastAndroid,
  BackAndroid
} from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../redux/actions/'
import * as WxapiActions from '../redux/actions/wxApi'
import { Tabs, Tab, Icon } from 'react-native-elements'
import LoginNavigationBar from '../components/navigationBar/login'
import MainNavigationBar from '../components/navigationBar/main'
import Home from './home'
import MyPage from './owner/'
import Login from './login'


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    titleStyle: {
        fontSize: 12,
        height: 18,
        color: '#333333',
    },
    selectedTitleStyle: {
        color:'#4caf50'
    },
    tabBarIcon: {
        width: 24, height: 20,
    },
    tabBarSelectedIcon: {
        width: 24, height: 20,
    }
})


class App extends Component {
  constructor(props){
    super(props)
    this.props.actions.islogin()
    this.renderScene = this.renderScene.bind(this)
    this.changeTab = this.changeTab.bind(this)
    this.state = {selectedTab: 'home', islogin: 0}
  }
  componentDidMount (){
    this.props.wxapiActions.registerApp() //微信API初始化
  }
  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  onBackAndroid = () => {
    console.log(this.lastBackPressed)
    if (this.lastBackPressed && (this.lastBackPressed + 2000) >= Date.now()) {
      //最近2秒内按过back键，可以退出应用。
      return false
    }
    this.lastBackPressed = Date.now()
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT)
    return true
  }
  //Navigation导航器场景载入
  renderScene (route, nav) {
    let Component = route.component;
    if(route.component) {
      return <Component {...this.props} {...route.params} navigator={nav} />
    }
  }
  changeTab (selectedTab) {
    this.setState({selectedTab})
  }
  renderTab(Component, selectedTab, title, navTitle, renderIcon, badgeText) {
        return (
          <Tab
            tabStyle={styles.tabSelectedstyle}
            titleStyle={[styles.titleStyle]}
            selectedTitleStyle={[styles.selectedTitleStyle]}
            selected={this.state.selectedTab === selectedTab}
            title={title}
            renderIcon={() => <Icon name={renderIcon} iconStyle={[styles.tabBarIcon]} />}
            renderSelectedIcon={() => <Icon name={renderIcon} iconStyle={styles.tabBarSelectedIcon}  color={'#4caf50'} />}
            badgeText = {badgeText}
            onPress={() => this.changeTab(selectedTab)}>
            <Navigator
            renderScene={this.renderScene}
            initialRoute={{ component: Component, title: navTitle}}
            configureScene={(route) => {
              if (route.sceneConfig) {
                return route.sceneConfig
              }
              return Navigator.SceneConfigs.FloatFromRight //默认场景动画
            }}
            navigationBar={MainNavigationBar}
            />
          </Tab>
        )
    }
    render() {
        if(this.props.loginState.status == 0){
          //登陆页面渲染
          return (<Navigator
              initialRoute={{title:'', component: Login}}
              configureScene={(route) => {
                return Navigator.SceneConfigs.FloatFromRight;
              }}
              renderScene={this.renderScene}
              navigationBar={LoginNavigationBar}
              />
          )
        }else if(this.props.loginState.status == 1){
          //主页面渲染
          return (
              <Tabs tabBarStyle={styles.container}>
                  {this.renderTab(Home, 'home', '首页', 'KAS记账', 'home')}
                  {this.renderTab(MyPage, 'mypage', '我', '用户信息', 'person')}
              </Tabs>
          )
        }
    }
}
function mapStateToProps(state) {
  return {
    loginState: state.loginState.toJS()
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
    wxapiActions: bindActionCreators(WxapiActions, dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App)
