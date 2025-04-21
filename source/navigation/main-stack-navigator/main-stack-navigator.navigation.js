import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Login from '../../pages/login-registration/login-registration.page';
import AuthCode from '../../pages/auth-code/auth-code.page';
import ForgotPassword from '../../pages/forgot-password/forgot-password.page';
import DrawerNavigator from '../drawer-navigator/drawer-navigation.navigation';
import FileUploading from '../../pages/file-uploading/file-uploading.page';
import AccountSettings from '../../components/accounts-settings/accounts-settings.component';
import KeyRing from '../../pages/key-ring/key-ring.component';
import MyKey from '../../pages/my-key/my-key.page';

const Stack = createStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="AuthCode" component={AuthCode} />
    <Stack.Screen name="Home" component={DrawerNavigator} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="AccountSettings" component={AccountSettings} />
    <Stack.Screen name="FileUploading" component={FileUploading}/>
    <Stack.Screen name="KeyRing" component={KeyRing}/>
    <Stack.Screen name="MyKey" component={MyKey}/>
  </Stack.Navigator>
);

export default MainStackNavigator;
