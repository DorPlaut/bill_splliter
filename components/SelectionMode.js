import React, { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';

const SelectionMode = ({ selectionType, setSelectionType }) => {
  return (
    <>
      <Pressable
        style={[
          styles.controlButton,
          {
            backgroundColor:
              selectionType === 'none' ? 'rgb(159, 255, 191)' : 'white',
          },
        ]}
        onPress={() => setSelectionType('none')}
      >
        <Text>None</Text>
      </Pressable>
      <Pressable
        style={[
          styles.controlButton,
          {
            backgroundColor:
              selectionType === 'item' ? 'rgb(159, 255, 191)' : 'white',
          },
        ]}
        onPress={() => setSelectionType('item')}
      >
        <Text>Item</Text>
      </Pressable>
      <Pressable
        style={[
          styles.controlButton,
          {
            backgroundColor:
              selectionType === 'total' ? 'rgb(159, 255, 191)' : 'white',
          },
        ]}
        onPress={() => setSelectionType('total')}
      >
        <Text>Total</Text>
      </Pressable>
      <Pressable
        style={[
          styles.controlButton,
          {
            backgroundColor:
              selectionType === 'tax' ? 'rgb(159, 255, 191)' : 'white',
          },
        ]}
        onPress={() => setSelectionType('tax')}
      >
        <Text>Tax</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  controlButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  controlText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectionMode;
