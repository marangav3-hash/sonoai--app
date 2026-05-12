import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SonoAI</Text>
      <Text style={styles.sub}>ULTRASOUND INTELLIGENCE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#085041', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 48, fontWeight: '700', color: '#E1F5EE' },
  sub: { fontSize: 13, color: '#5DCAA5', letterSpacing: 3, marginTop: 8 },
});
