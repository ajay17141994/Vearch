import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TransactionScreen from './TransactionScreen';
import AddBeneficiary from './AddBeneficiary';
import BeneficiaryList from './BeneficiaryList';
import { TransactionProvider } from './TransactionContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <TransactionProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Transaction" component={TransactionScreen} />
          <Stack.Screen name="AddBeneficiary" component={AddBeneficiary} />
          <Stack.Screen name="BeneficiaryList" component={BeneficiaryList} />
        </Stack.Navigator>
      </NavigationContainer>
    </TransactionProvider>
  );
};

export default App;
