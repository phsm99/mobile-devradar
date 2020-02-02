import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Main from './pages/Main';
import Profile from './pages/Profile';
import CreateDev from './pages/CreateDev'
const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main,
            navigationOptions: {
                title: 'DevRadar'
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'Tela de Perfil'
            }
        },
        CreateDev: {
            screen: CreateDev,
            navigationOptions: {
                title: 'Criar Perfil'
            }
        }
    }, {
        defaultNavigationOptions: {
            headerTintColor: '#FFF',
            headerBackTitleVisible: false,
            headerStyle: {
                backgroundColor: '#7D40E7'
            }
        }
    })
);

export default Routes;
