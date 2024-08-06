import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { Feather, MaterialIcons, Octicons } from '@expo/vector-icons';
import PeopleList from '../components/PeopleList';
import ItemList from '../components/ItemList';
import TotalCheck from '../components/TotalCheck';
import FinalComponent from '../components/FinalComponent';

// Constants for the different sections
const SECTIONS = ['People', 'Items', 'Total', 'Summary'];

const data = `{
  "items": [
    {
      "id": "zdvcxcv4",
      "name": "Chicken Tenders",
      "quantity": 1,
      "price": 11,
      "assignTo": []
    },
    {
      "id": "asdfadf4",
      "name": "Bacon Burger Meal",
      "quantity": 1,
      "price": 18.50,
      "assignTo": []
    },
    {
      "id": "asdf1",
      "name": "Cold Drink",
      "quantity": 3,
      "price": 2.75,
      "assignTo": []
    },
    {
      "id": "asddff1",
      "name": "Caesar Salad",
      "quantity": 1,
      "price": 9.5,
      "assignTo": []
    }
  ],
  "currency": "$",
  "taxes": 15,
  "discount": 0,
  "tip": 0,
  "total": 100
}`;

const Split = () => {
  // Data from params
  // const { data } = useLocalSearchParams();
  const parsedData = JSON.parse(data);
  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState(parsedData.items);
  const [allAssignd, setAllAssignd] = useState(false);
  const [total, setTotal] = useState(parsedData.total);
  const [tax, setTax] = useState(parsedData.taxes);
  const [tip, setTip] = useState(parsedData.tip);
  const [activeSection, setActiveSection] = useState('Items');
  const [currency, setCurrency] = useState(parsedData.currency);

  // Effect to set loading state
  useEffect(() => {
    if (parsedData) {
      setIsLoading(false);
    }
  }, []);

  // Function to toggle section visibility
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Helper function to assign colors to people based on their position in the list
  const getPersonColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    return colors[index % colors.length];
  };

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
  // Recalculate total whenever relevant dependencies change
  useEffect(() => {
    calculateTotal();
  }, [items, tax, tip, setTax, setTip, setTotal]);

  // Function to render each section
  const renderSection = (section) => {
    const isActive = activeSection === section;
    return (
      <View key={section} style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection(section)}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>{section}</Text>
          {/* section specific elements */}
          {isActive || (
            <View style={styles.sectionSubTitle}>
              {section === 'People' && (
                <View style={styles.peopleList}>
                  {people.map((person, index) => (
                    <View
                      key={person.id}
                      style={[
                        styles.person,
                        { marginRight: index !== people.length - 1 ? 10 : 0 },
                      ]}
                    >
                      <View
                        style={[
                          styles.personAvatar,
                          { backgroundColor: getPersonColor(index) },
                        ]}
                      >
                        <Image
                          source={require('../assets/images/default-user-image.png')}
                          style={styles.personImage}
                        />
                        <Text style={styles.personName}>
                          {person.name.slice(0, 4)}
                          {person.name.length > 4 && '..'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {section === 'Items' && (
                <View style={styles.itemSummary}>
                  <Text style={styles.itemTag}>items: {items.length}</Text>
                  {allAssignd ? (
                    <Text
                      style={[
                        styles.itemTag,
                        { backgroundColor: '#20a124', color: 'white' },
                      ]}
                    >
                      <Octicons name="check-circle" size={10} color="white" />{' '}
                      All Items Assignd
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.itemTag,
                        { backgroundColor: '#be1010', color: 'white' },
                      ]}
                    >
                      <Octicons name="x-circle" size={10} color="white" />{' '}
                      Unassigned items
                    </Text>
                  )}
                </View>
              )}
              {section === 'Total' && (
                <View style={styles.totalSummary}>
                  <Text style={styles.totalPrice}>
                    {total}
                    {currency}
                  </Text>
                  <Text
                    style={styles.totalText}
                  >{`(include tax and tip)`}</Text>
                </View>
              )}
            </View>
          )}

          {/* button */}
          <MaterialIcons
            name={isActive ? 'expand-less' : 'expand-more'}
            size={24}
            color="#4CAF50"
          />
        </TouchableOpacity>
        {isActive && (
          <View style={styles.sectionContent}>
            {section === 'People' && (
              <PeopleList people={people} setPeople={setPeople} />
            )}
            {section === 'Items' && (
              <ItemList
                people={people}
                items={items}
                setItems={setItems}
                allAssignd={allAssignd}
                setAllAssignd={setAllAssignd}
                currency={currency}
              />
            )}
            {section === 'Total' && (
              <TotalCheck
                people={people}
                items={items}
                total={total}
                setTotal={setTotal}
                currency={currency}
                tax={tax}
                setTax={setTax}
                tip={tip}
                setTip={setTip}
              />
            )}
            {section === 'Summary' && (
              <FinalComponent
                people={people}
                items={items}
                total={total}
                currency={currency}
                tax={tax}
                tip={tip}
              />
            )}
          </View>
        )}
      </View>
    );
  };

  // Main component rendering
  return (
    <>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <ScrollView>
            {SECTIONS.map(renderSection)}
            <View style={styles.btnContainer}>
              <Link href="/camera" asChild>
                <TouchableOpacity style={styles.button}>
                  <MaterialIcons name="camera-alt" size={24} color="#FFF" />
                  <Text style={styles.buttonText}>Scan Again</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/" asChild>
                <TouchableOpacity style={styles.button}>
                  <MaterialIcons name="home" size={24} color="#FFF" />
                  <Text style={styles.buttonText}>Home Page</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                <Link href={'https://www.dorplaut.com/'}>
                  Build by Dor Plaut &copy;
                </Link>
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    // padding: 16,
  },
  section: {
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'scroll',
    elevation: 2,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  sectionContent: {
    padding: 16,
  },
  btnContainer: {
    marginBottom: 10,
  },
  button: {
    margin: 10,

    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // people section visualzation
  peopleList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  person: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  personAvatar: {
    height: 25,
    width: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personImage: {
    height: '80%',
    width: '80%',
    resizeMode: 'contain',
  },
  personName: {
    position: 'absolute',
    bottom: -10,
    fontSize: 9,
    color: 'black',
  },
  // items
  itemSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTag: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 5,
  },
  // total
  totalSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  totalText: {
    fontSize: 10,
    marginLeft: 10,
  },

  // footer
  footer: {
    position: 'static',
    width: '100%',
    // backgroundColor: 'rgba(0, 0, 0, 0.452)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'black',
    padding: 5,
  },
});

export default Split;
