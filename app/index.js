import { Link } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const Index = () => {
  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{ width: 100, height: 100 }}
            />
            <Text style={styles.title}>Bill Splitter</Text>
          </View>
          <Text style={styles.subtitle}>
            Split bills effortlessly with friends
          </Text>
          <Link href="/camera" asChild>
            <TouchableOpacity style={styles.button}>
              <MaterialIcons name="camera-alt" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Scan Receipt</Text>
            </TouchableOpacity>
          </Link>
          <View style={styles.features}>
            <FeatureItem icon="receipt" text="Instant bill recognition" />
            <FeatureItem icon="group" text="Easy group splitting" />
            <FeatureItem icon="calculate" text="Accurate calculations" />
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Link href={'https://www.dorplaut.com/'}>
              Build by Dor Plaut &copy;
            </Link>
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <MaterialIcons name={icon} size={24} color="#FFF" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  features: {
    marginTop: 60,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.452)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    padding: 5,
  },
});

export default Index;
