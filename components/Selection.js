import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Selection = (props) => {
  const color = 'rgba(60, 255, 0, 0.3)';

  return (
    <View
      style={[props.style, styles.selection, { backgroundColor: color }]}
    ></View>
  );
};

const styles = StyleSheet.create({
  selection: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.425)',
  },
});

export default Selection;
