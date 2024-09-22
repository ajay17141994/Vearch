import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddBeneficiary from './src/AddBeneficiary';
import BeneficiaryList from './src/BeneficiaryList';
import TransactionScreen from './src/TransactionScreen';
import { loadBeneficiaries, storeBeneficiaries, storeTransactions, loadTransactions } from './src/storage';

const Stack = createStackNavigator();

const App = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchStoredData = async () => {
      const storedBeneficiaries = await loadBeneficiaries();
      const storedTransactions = await loadTransactions();
      setBeneficiaries(storedBeneficiaries);
      setTransactions(storedTransactions);
    };

    fetchStoredData();
  }, []);

  const addBeneficiary = (beneficiary) => {
    const updatedBeneficiaries = [...beneficiaries, beneficiary];
    setBeneficiaries(updatedBeneficiaries);
    storeBeneficiaries(updatedBeneficiaries);
  };

  const handleTransactionComplete = (transaction) => {
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    storeTransactions(updatedTransactions);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddBeneficiary">
        
        <Stack.Screen name="AddBeneficiary" options={{ title: 'Add Beneficiary' }}>
          {(props) => <AddBeneficiary {...props} addBeneficiary={addBeneficiary} />}
        </Stack.Screen>
        
        <Stack.Screen name="BeneficiaryList" options={{ title: 'Beneficiaries' }}>
          {(props) => (
            <BeneficiaryList 
              {...props} 
              beneficiaries={beneficiaries} 
              onSelect={(beneficiary) => props.navigation.navigate('TransactionScreen', { beneficiary })}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="TransactionScreen" options={{ title: 'Make a Transaction' }}>
          {(props) => (
            <TransactionScreen 
              {...props} 
              onTransactionComplete={handleTransactionComplete} 
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
