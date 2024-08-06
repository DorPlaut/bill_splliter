import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const SelectionControls = ({
  handleDeleteSelected,
  isSelectedhandleComplete,
  isSelected,
  handleComplete,
}) => {
  return (
    <>
      {isSelected && (
        <Pressable
          style={[styles.controlButton]}
          onPress={handleDeleteSelected}
        >
          <Text>Delete Selection</Text>
        </Pressable>
      )}

      <Pressable style={[styles.controlButton]} onPress={handleComplete}>
        <Text>Complete </Text>
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

export default SelectionControls;
