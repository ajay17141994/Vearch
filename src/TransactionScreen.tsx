import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { loadBeneficiaries, loadTransactions, storeBeneficiaries, storeTransactions } from "./storage";
import { styles } from "./styles";

interface Beneficiary {
  firstName: string;
  lastName: string;
  iban: string;
  balance?: number;
}

// Define props interface
interface TransactionScreenProps {
  route: {
    params: {
      beneficiary: Beneficiary;
    };
  };
  navigation: {
    goBack: () => void;
  };
  onTransactionComplete: (transaction: {
    beneficiary: Beneficiary;
    amount: number;
    date: string;
  }) => void;
}
interface Transaction {
  beneficiary: Beneficiary;
  amount: number;
  date: string;
}

const TransactionScreen: React.FC<TransactionScreenProps> = ({
  route,
  navigation,
  onTransactionComplete,
}) => {
  const { beneficiary } = route.params;
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<number>(beneficiary.balance || 1000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);



  useEffect(() => {
    const fetchTransactions = async () => {
      const allTransactions = await loadTransactions();
      const userTransactions = allTransactions.filter(
        (transaction) => transaction.beneficiary.iban === beneficiary.iban
      );
      setTransactions(userTransactions);
    };

    fetchTransactions();
  }, [beneficiary.iban]);
  const handleTransaction = async () => {
    const transactionAmount = parseFloat(amount);
  
    if (transactionAmount > 0 && transactionAmount <= balance) {
      const newBalance = balance - transactionAmount;
      setBalance(newBalance); 
  
      const transaction = {
        beneficiary: { ...beneficiary, balance: newBalance },
        amount: transactionAmount,
        date: new Date().toISOString(),
      };
  
      const storedBeneficiaries = await loadBeneficiaries();
  
      const updatedBeneficiaries = storedBeneficiaries.map((b) =>
        b.iban === beneficiary.iban ? { ...b, balance: newBalance } : b
      );
  
      await storeBeneficiaries(updatedBeneficiaries);
  
      const allTransactions = await loadTransactions();
  
      await storeTransactions([...allTransactions, transaction]);
  
      onTransactionComplete(transaction);
  
      navigation.goBack();
    } else {
      alert("Invalid transaction amount");
    }
  };
  
  
  return (
    <View style={styles.transactionContainer}>
      <Text style={styles.label}>Beneficiary:</Text>
      <Text
        style={styles.text}
      >{`${beneficiary.firstName} ${beneficiary.lastName}`}</Text>

      <Text style={styles.label}>IBAN:</Text>
      <Text style={styles.text}>{beneficiary.iban}</Text>

      <Text style={styles.label}>Current Balance:</Text>
      <Text style={styles.balanceText}>{balance}</Text>

      <TextInput
        style={styles.transactionInput}
        placeholder="Enter transaction amount"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.transactionButton}
        onPress={handleTransaction}
      >
        <Text style={styles.transactionButtonText}>Complete Transaction</Text>
      </TouchableOpacity>
      <View style={styles.previousTransactionsCard}>
        <Text style={styles.label}>Previous Transactions:</Text>
        {transactions.length === 0 ? (
          <Text style={styles.noTransactionsText}>
            No transactions found for this beneficiary.
          </Text>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>{`Amount: ${item.amount}`}</Text>
                <Text style={styles.transactionDate}>{`Date: ${new Date(item.date).toLocaleString()}`}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default TransactionScreen;
