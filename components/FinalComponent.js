import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const FinalComponent = ({ people, items, total, tax, tip, currency }) => {
  const payments = useMemo(() => {
    // Calculate subtotal based on items price and quantity
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate shared costs (tax + tip) and distribute them evenly among people
    const sharedCosts = tax + tip;
    const perPersonSharedCost = sharedCosts / people.length;

    // Map through each person to calculate their individual cost including shared costs
    return people.map((person) => {
      const personItems = items.filter((item) =>
        item.assignTo.includes(person)
      );

      // Calculate the cost of items assigned to the person, divided by the number of assignees
      const personItemsCost = personItems.reduce((sum, item) => {
        const itemCost = item.price * item.quantity;
        const assignedPeople = item.assignTo.length;
        return sum + itemCost / assignedPeople;
      }, 0);

      // Sum the person's item costs with their share of the shared costs
      const personShare = personItemsCost + perPersonSharedCost;

      // Calculate the percentage of the total cost that the person is responsible for
      const percentageOfTotal = (personShare / total) * 100;

      return {
        name: person.name,
        pay: personShare.toFixed(2),
        percentage: percentageOfTotal.toFixed(1),
        items: personItems,
      };
    });
  }, [people, items, total, tax, tip]); // Dependencies triggering recalculation

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payment Summary</Text>
      {payments.map((payment) => (
        <View key={payment.name} style={styles.paymentCard}>
          {/* Display person's name and payment details */}
          <View style={styles.paymentHeader}>
            <Text style={styles.personName}>{payment.name}</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentAmount}>
                {currency}
                {payment.pay}
              </Text>
              <Text style={styles.paymentPercentage}>
                ({payment.percentage}%)
              </Text>
            </View>
          </View>
          {/* List items assigned to the person */}
          <View style={styles.itemList}>
            {payment.items.map((item) => (
              <View key={item.id} style={styles.item}>
                <MaterialIcons name="receipt" size={16} color="#4CAF50" />
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  {currency}
                  {(
                    (item.price * item.quantity) /
                    item.assignTo.length
                  ).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  personName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentPercentage: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  itemList: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default FinalComponent;
