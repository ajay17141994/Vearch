import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { loadBeneficiaries } from "./storage";
import { formFields } from "../constant";
import { validateIban } from "../utils";
import { styles } from "./styles";

interface Beneficiary {
  firstName: string;
  lastName: string;
  iban: string;
  balance: number;
}

interface AddBeneficiaryProps {
  navigation: any;
  addBeneficiary: (beneficiary: Beneficiary) => void;
}

const AddBeneficiary: React.FC<AddBeneficiaryProps> = ({
  navigation,
  addBeneficiary,
}) => {
  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    iban: string;
  }>({
    firstName: "",
    lastName: "",
    iban: "",
  });
  const [error, setError] = useState<string>("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      const storedBeneficiaries: Beneficiary[] = await loadBeneficiaries();
      setBeneficiaries(storedBeneficiaries || []);
    };

    fetchBeneficiaries();
  }, []);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({
      ...form,
      [key]: value,
    });
  };
const handleSubmit = async () => {
    const storedBeneficiaries: Beneficiary[] = await loadBeneficiaries();
    const existingBeneficiary = storedBeneficiaries.find(
      (incomingBeneficiary) => incomingBeneficiary.iban === form?.iban
    );
    if (existingBeneficiary) {
      setError("IBAN already exists");
      return;
    }
  
    if (validateIban(form.iban)) {
      const newBeneficiary: Beneficiary = {
        firstName: form.firstName,
        lastName: form.lastName,
        iban: form.iban,
        balance: 1000,
      };
      await addBeneficiary(newBeneficiary);
      setForm({ firstName: "", lastName: "", iban: "" });
      setError("");
      navigation.navigate("BeneficiaryList");
    } else {
      setError("Invalid IBAN");
    }
  };

  const navigateToBeneficiaryList = () => {
    navigation.navigate("BeneficiaryList");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {formFields.map((field, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={field.placeholder}
            value={form[field.key as keyof typeof form]}
            onChangeText={(value) =>
              handleChange(field.key as keyof typeof form, value)
            }
            placeholderTextColor="#888"
          />
        ))}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Beneficiary</Text>
        </TouchableOpacity>

        {beneficiaries.length > 0 && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={navigateToBeneficiaryList}
          >
            <Text style={styles.linkButtonText}>Go to Beneficiary List</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AddBeneficiary;
