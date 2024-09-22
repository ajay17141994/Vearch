import AsyncStorage from '@react-native-async-storage/async-storage';

// Save beneficiaries to AsyncStorage
export const storeBeneficiaries = async (beneficiaries) => {
  try {
    const jsonValue = JSON.stringify(beneficiaries);
    await AsyncStorage.setItem('beneficiaries', jsonValue);
  } catch (e) {
    console.error('Error saving beneficiaries', e);
  }
};

// Load beneficiaries from AsyncStorage
export const loadBeneficiaries = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('beneficiaries');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading beneficiaries', e);
  }
};

// Save transaction history to AsyncStorage
export const storeTransactions = async (transactions) => {
  try {
    const jsonValue = JSON.stringify(transactions);
    await AsyncStorage.setItem('transactions', jsonValue);
  } catch (e) {
    console.error('Error saving transactions', e);
  }
};

// Load transaction history from AsyncStorage
export const loadTransactions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('transactions');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading transactions', e);
  }
};
