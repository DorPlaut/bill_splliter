// ItemList.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ItemList = ({
  people,
  items,
  setItems,
  allAssignd,
  setAllAssignd,
  currency,
}) => {
  // Local state
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Function to add an item to the list
  const addItem = () => {
    if (editName.trim() && editPrice.trim()) {
      const newItem = {
        id: Date.now(),
        name: editName.trim(),
        price: parseFloat(editPrice),
        quantity: 1,
        assignTo: [],
      };
      setItems([...items, newItem]);
      setEditName('');
      setEditPrice('');
      setIsAddingNew(false);
    }
  };

  // set AllAssignd
  useEffect(() => {
    const isAllAssigned = items.every((itm) => itm.assignTo.length >= 1);
    setAllAssignd(isAllAssigned);
  }, [items]);

  return (
    <View style={styles.container}>
      {items.length >= 1 ? (
        items.map((item, index) => {
          return (
            <Item
              key={index}
              item={item}
              items={items}
              setItems={setItems}
              people={people}
              currency={currency}
            />
          );
        })
      ) : (
        <Text style={styles.noItems}>
          No items added. Tap the "+" button to add an item.
        </Text>
      )}
      {isAddingNew ? (
        <View style={styles.addItemForm}>
          <TextInput
            style={styles.input}
            placeholder="Item name"
            value={editName}
            onChangeText={setEditName}
          />
          <TextInput
            style={styles.input}
            placeholder="Item price"
            value={editPrice}
            onChangeText={setEditPrice}
            keyboardType="decimal-pad"
          />
          <View style={styles.addItemButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsAddingNew(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.addButton,
                (!editName.trim() || !editPrice.trim()) &&
                  styles.disabledButton,
              ]}
              onPress={addItem}
              disabled={!editName.trim() || !editPrice.trim()}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setIsAddingNew(true)}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
        // <TouchableOpacity
        //   style={styles.floatingActionButton}
        //   onPress={() => setIsAddingNew(true)}
        // >
        //   <MaterialIcons name="add" size={24} color="white" />
        // </TouchableOpacity>
      )}
    </View>
  );
};

// Item component
const Item = ({ item, items, setItems, people, currency }) => {
  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editPrice, setEditPrice] = useState(item.price.toString());
  const [isAssigning, setIsAssigning] = useState(false);
  const nameMaxLength = 20;

  // Function to edit item from the quntity
  const updateQuantity = (newQuantity) => {
    if (newQuantity >= 1) {
      setItems(
        items.map((i) =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        )
      );
    }
  };

  // Function to remove an item from the list
  const removeItem = () => {
    setItems(items.filter((i) => i.id !== item.id));
  };

  // Function to edit an item's details
  const editItem = () => {
    if (editName.trim() && editPrice.trim()) {
      setItems(
        items.map((i) =>
          i.id === item.id
            ? { ...i, name: editName.trim(), price: parseFloat(editPrice) }
            : i
        )
      );
      setIsEditing(false);
    }
  };

  // Function to assign items to people
  const assignItemToPerson = (person) => {
    const newItems = items.map((i) =>
      i.id === item.id
        ? {
            ...i,
            assignTo: i.assignTo.includes(person)
              ? i.assignTo.filter((p) => p !== person)
              : [...i.assignTo, person],
          }
        : i
    );
    setItems(newItems);
  };

  // Remove person assignment if person is remove from people list
  useEffect(() => {
    setItems(
      items.map((i) => ({
        ...i,
        assignTo: i.assignTo.filter((p) => people.includes(p)),
      }))
    );
  }, [people]);

  // People colors
  const getPersonColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.itemContainer}>
      {isEditing ? (
        <View style={styles.editForm}>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder="Item name"
          />
          <TextInput
            style={styles.input}
            value={editPrice}
            onChangeText={setEditPrice}
            keyboardType="decimal-pad"
            placeholder="Item price"
          />
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={editItem}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.itemInfo}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>
              {item.name.slice(0, nameMaxLength)}
              {item.name.length > nameMaxLength && '...'}
            </Text>
            <Text style={styles.itemPrice}>
              {currency}
              {(item.price * item.quantity).toFixed(2)}
            </Text>
            {/* people list */}
            <View style={styles.peopleList}>
              {people.map((person, index) => {
                if (item.assignTo.includes(person))
                  return (
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
                  );
              })}
            </View>
            {/*  */}
          </View>

          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.quantity - 1)}
            >
              <MaterialIcons name="remove" size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.quantity + 1)}
            >
              <MaterialIcons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => setIsEditing(!isEditing)}
        >
          <MaterialIcons name="edit" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.removeButton]}
          onPress={removeItem}
        >
          <MaterialIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
        {people.length > 0 && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.assignButton,
              { backgroundColor: isAssigning ? '#00aeff' : '#499cc2' },
            ]}
            onPress={() => setIsAssigning(!isAssigning)}
          >
            <MaterialIcons name="person-add" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {isAssigning && people.length > 0 && (
        <View style={styles.assignContainer}>
          <FlatList
            data={people}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(person) => person.id.toString()}
            renderItem={({ item: person, index }) => (
              <TouchableOpacity
                style={[
                  styles.personButton,
                  {
                    backgroundColor: getPersonColor(index),
                    opacity: item.assignTo.includes(person) ? 1 : 0.5,
                  },
                ]}
                onPress={() => assignItemToPerson(person)}
              >
                <Image
                  source={require('../assets/images/default-user-image.png')}
                  style={styles.personImage}
                />
                <Text
                  style={[styles.personName, { fontSize: 12, bottom: -17 }]}
                >
                  {person.name.slice(0, 4)}
                  {person.name.length > 4 && '..'}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  noItems: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },

  addItemForm: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    fontSize: 18,
  },
  addItemButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.5,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 12,
    color: '#333',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#FF9500',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
  },
  bottomButton: {
    margin: 0,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editForm: {
    marginBottom: 16,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#4CD964',
  },
  assignContainer: {
    marginTop: 16,
  },
  // people section visualzation
  personButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
    height: 48,
    padding: 8,
    marginBottom: 15,
    borderRadius: 50,
  },
  peopleList: {
    flexWrap: 'wrap',
    maxWidth: '60%',
    position: 'absolute',
    top: 49,
    left: 0,
    flexDirection: 'row',
  },
  person: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
});

export default ItemList;
