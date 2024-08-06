import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const TotalCheck = ({
  items,
  tax,
  setTax,
  tip,
  setTip,
  total,
  setTotal,
  currency,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tipMethod, setTipMethod] = useState(null);
  const [tipPercentage, setTipPercentage] = useState('');

  // Calculate subtotal based on items' price and quantity
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Calculate total including subtotal, tax, and tip
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const totalWithTaxAndTip = subtotal + tax + tip;
    setTotal(parseFloat(totalWithTaxAndTip.toFixed(2)));
  };

  // Set tip based on percentage of subtotal
  const setByPercentage = (value) => {
    const percentage = parseFloat(value);
    if (!isNaN(percentage) && percentage >= 0) {
      const subtotal = calculateSubtotal();
      const calculatedTip = ((percentage / 100) * subtotal).toFixed(2);
      setTip(parseFloat(calculatedTip));
      setTipPercentage(value);
    }
  };

  // Set tip based on a fixed amount
  const setByAmount = (value) => {
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount >= 0) {
      setTip(parseFloat(amount.toFixed(2)));
    }
  };

  // Render component UI
  return (
    <View style={styles.container}>
      {/* Display subtotal */}
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal:</Text>
        <Text style={styles.value}>
          {currency}
          {calculateSubtotal().toFixed(2)}
        </Text>
      </View>
      {/* Display taxes and extra fees */}
      <View style={styles.row}>
        <Text style={styles.label}>Taxes and extra fees:</Text>
        <Text style={styles.value}>
          {currency}
          {tax.toFixed(2)}
        </Text>
      </View>
      {/* Display tip */}
      <View style={styles.row}>
        <Text style={styles.label}>Tip:</Text>
        <Text style={styles.value}>
          {currency}
          {tip.toFixed(2)} ( {((tip / (total - tip - tax)) * 100).toFixed(0)}%)
        </Text>
      </View>
      {/* Button to edit tip */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setIsEditing(!isEditing);
          if (isEditing) setTipMethod(null);
        }}
      >
        <MaterialIcons
          name={isEditing ? 'close' : 'edit'}
          size={24}
          color="white"
        />
        <Text style={styles.editButtonText}>
          {isEditing ? 'Close' : 'Change Tip'}
        </Text>
      </TouchableOpacity>
      {/* Options to set tip by amount or percentage */}
      {isEditing && tipMethod === null && (
        <View style={styles.tipMethodContainer}>
          <TouchableOpacity
            style={styles.tipMethodButton}
            onPress={() => setTipMethod('amount')}
          >
            <MaterialIcons name="attach-money" size={24} color="white" />
            <Text style={styles.tipMethodButtonText}>By Dollars</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tipMethodButton}
            onPress={() => setTipMethod('percentage')}
          >
            <MaterialIcons name="percent" size={24} color="white" />
            <Text style={styles.tipMethodButtonText}>By Percentage</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Input field for tip amount or percentage */}
      {isEditing && tipMethod && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder={
              tipMethod === 'amount'
                ? 'Enter tip amount'
                : 'Enter tip percentage'
            }
            value={tipMethod === 'amount' ? tip.toString() : tipPercentage}
            onChangeText={
              tipMethod === 'amount' ? setByAmount : setByPercentage
            }
          />
        </View>
      )}
      {/* Display total check amount */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>
          {currency}
          {total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

// Stylesheet for component
const styles = StyleSheet.create({
  container: {
    overflow: 'scroll',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  editButton: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // backgroundColor: '#4CAF50',
    // padding: 12,
    // borderRadius: 8,
    // marginTop: 16,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  tipMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CD964',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  tipMethodButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2aaa2e',
  },
});

export default TotalCheck;
