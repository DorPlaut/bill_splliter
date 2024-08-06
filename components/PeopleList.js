// PeopleList.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

// Main component for displaying a list of people and managing interactions
const PeopleList = ({ people, setPeople }) => {
  // State for editing name input and toggling new person addition UI
  const [editName, setEditName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Function to add a new person to the list
  const addPerson = () => {
    if (editName.trim()) {
      setPeople([...people, { id: Date.now(), name: editName.trim() }]);
      setEditName('');
      setIsAddingNew(false);
    }
  };

  // Helper function to assign colors to people based on their position in the list
  const getPersonColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      {/* Conditional rendering based on whether there are people in the list */}
      {people.length >= 1 ? (
        <View style={styles.list}>
          {people.map((person, index) => {
            return (
              // Render Person component for each person in the list
              <Person
                key={index}
                person={person}
                people={people}
                setPeople={setPeople}
                color={getPersonColor(index)}
              />
            );
          })}
        </View>
      ) : (
        // Display message when the list is empty
        <Text style={styles.noItems}>The group is empty</Text>
      )}
      {/* Conditional rendering for adding new person form */}
      {isAddingNew ? (
        <View style={styles.addPersonForm}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={editName}
            onChangeText={setEditName}
          />
          <View style={styles.addPersonButtons}>
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
                !editName.trim() && styles.disabledButton,
              ]}
              onPress={addPerson}
              disabled={!editName.trim()}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Floating action button for adding new people
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setIsAddingNew(true)}
        >
          <MaterialIcons name="person-add" size={24} color="white" />
          <Text style={styles.buttonText}> Add Person</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Component for individual person items
const Person = ({ person, people, setPeople, color }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(person.name);

  // Function to remove a person from the list
  const removePerson = (id) => {
    setPeople(people.filter((person) => person.id !== id));
  };

  // Function to edit a person's name
  const editPerson = (id) => {
    if (editName.trim()) {
      const updatedPeople = people.map((p) =>
        p.id === id ? { ...p, name: editName.trim() } : p
      );
      setPeople(updatedPeople);
      setIsEditing(false);
    }
  };

  return (
    <View style={styles.personContainer}>
      {/* Conditional rendering based on whether person is being edited */}
      {isEditing ? (
        <View style={styles.editForm}>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder="Name"
          />
          <View style={styles.personActions}>
            <TouchableOpacity
              style={[styles.iconButton, styles.saveButton]}
              onPress={() => editPerson(person.id)}
            >
              <Octicons name="check-circle" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
            >
              <Octicons name="x-circle" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Display person information and action buttons
        <View style={styles.personInfo}>
          <View style={[styles.personAvatar, { backgroundColor: color }]}>
            <Image
              source={require('../assets/images/default-user-image.png')}
              style={styles.personImage}
            />
          </View>
          <Text style={styles.personName}>
            {person.name.slice(0, 5)}
            {person.name.length > 5 && '..'}
          </Text>
          <View style={styles.personActions}>
            <TouchableOpacity
              style={[styles.iconButton, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <MaterialIcons name="edit" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, styles.removeButton]}
              onPress={() => removePerson(person.id)}
            >
              <MaterialIcons name="delete" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// StyleSheet for styling components
const styles = StyleSheet.create({
  container: {},
  list: {
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noItems: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: '#888',
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
  addPersonForm: {
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
    padding: 9,
    marginBottom: 8,
    fontSize: 18,
  },
  addPersonButtons: {
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
  saveButton: {
    backgroundColor: '#4CD964',
  },
  disabledButton: {
    opacity: 0.5,
  },
  personContainer: {
    // flex: 1,
    width: '28%',
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  personInfo: {
    alignItems: 'center',
  },
  personAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  personImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  personActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#FF9500',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
  },
  editForm: {
    marginBottom: 8,
  },
  editButtons: {
    backgroundColor: 'blue',
  },
  editMiniButton: {
    width: '',
    fontSize: 11,
  },
});

export default PeopleList;
