import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { loadBeneficiaries } from "./storage";
import { styles } from "./styles";

interface Beneficiary {
  firstName: string;
  lastName: string;
  iban: string;
  balance?: number;
}

interface BeneficiaryListProps {
  beneficiaries: Beneficiary[];
  onSelect: (beneficiary: Beneficiary) => void;
}

const BeneficiaryList: React.FC<BeneficiaryListProps> = ({
  beneficiaries,
  onSelect,
}) => {
  const [localBeneficiaries, setLocalBeneficiaries] =
    useState<Beneficiary[]>(beneficiaries);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedBeneficiaries = async () => {
        const storedBeneficiaries: Beneficiary[] = await loadBeneficiaries();
        setLocalBeneficiaries(storedBeneficiaries || []);
      };

      fetchUpdatedBeneficiaries();
    }, [])
  );

  const renderBeneficiary = ({ item }: { item: Beneficiary }) => (
    <TouchableOpacity onPress={() => onSelect(item)}>
      <View style={styles.beneficiaryItem}>
        <View style={styles.beneficiaryDetails}>
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.iban}>IBAN: {item.iban}</Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balance}>Balance: {item.balance || 1000}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {localBeneficiaries.length === 0 ? (
        <Text>No beneficiaries added yet.</Text>
      ) : (
        <FlatList
          data={localBeneficiaries?.reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBeneficiary}
        />
      )}
    </View>
  );
};

export default BeneficiaryList;
