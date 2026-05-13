import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/sonoai';
const MODES = ['B-mode', 'M-mode', 'Doppler'];
const INDICATIONS = ['OB-biometry', 'POCUS', 'Anomaly screening', 'Emergency triage'];
export default function ScanScreen({ navigation }) {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [scanMode, setScanMode] = useState('B-mode');
  const [indication, setIndication] = useState('OB-biometry');
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState('');
  const pickFile = async () => {
    const r = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
    if (r.canceled === false && r.assets && r.assets[0]) setFile(r.assets[0]);
  };
  const handleUpload = async () => {
    if (!file) return Alert.alert('No file', 'Select a DICOM file first.');
    setUploading(true);
    try {
      setStage('Uploading DICOM file...');
      const scan = await api.uploadScan(token, file.uri, scanMode, indication);
      setStage('Anonymising patient data...');
      await new Promise(r => setTimeout(r, 800));
      setStage('Running AI inference...');
      const result = await api.pollResult(token, scan.id);
      navigation.replace('Result', { scanId: scan.id, result });
    } catch(e) { Alert.alert('Error', e.message); }
    finally { setUploading(false); setStage(''); }
  };
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.label}>DICOM FILE</Text>
      <TouchableOpacity style={s.picker} onPress={pickFile}>
        <View>
          <Text style={s.pickerIcon}>{file ? file.name : '+'}</Text>
          <Text style={s.pickerText}>{file ? 'File selected' : 'Tap to select DICOM file'}</Text>
        </View>
      </TouchableOpacity>
      <Text style={s.label}>SCAN MODE</Text>
      <View style={s.chips}>
        {MODES.map(m => (
          <TouchableOpacity key={m} style={[s.chip, scanMode === m && s.chipOn]} onPress={() => setScanMode(m)}>
            <Text style={[s.chipText, scanMode === m && s.chipTextOn]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.label}>INDICATION</Text>
      <View style={s.chips}>
        {INDICATIONS.map(i => (
          <TouchableOpacity key={i} style={[s.chip, indication === i && s.chipOn]} onPress={() => setIndication(i)}>
            <Text style={[s.chipText, indication === i && s.chipTextOn]}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.disclaimer}>
        <Text style={s.disclaimerText}>Patient data is anonymised immediately on upload.</Text>
      </View>
      <View style={s.buttonArea}>
        {uploading ? (
          <View style={s.uploadingBox}>
            <ActivityIndicator size="large" color="#1D9E75" />
            <Text style={s.stage}>{stage}</Text>
          </View>
        ) : (
          <TouchableOpacity style={[s.btn, !file && s.btnDisabled]} onPress={handleUpload} disabled={!file}>
            <Text style={s.btnText}>Run AI analysis</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F5' },
  content: { padding: 20 },
  label: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 2, marginBottom: 10, marginTop: 20 },
  picker: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 2, borderColor: '#1D9E75', borderStyle: 'dashed', padding: 32, alignItems: 'center' },
  pickerIcon: { fontSize: 28, color: '#1D9E75', textAlign: 'center' },
  pickerText: { fontSize: 13, color: '#085041', textAlign: 'center', marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  chipOn: { backgroundColor: '#085041', borderColor: '#085041' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextOn: { color: '#fff', fontWeight: '600' },
  disclaimer: { backgroundColor: '#E1F5EE', borderRadius: 10, padding: 14, marginTop: 24 },
  disclaimerText: { fontSize: 12, color: '#085041', lineHeight: 18 },
  buttonArea: { marginTop: 24 },
  uploadingBox: { alignItems: 'center', padding: 32, gap: 12 },
  stage: { fontSize: 14, color: '#085041', fontWeight: '500' },
  btn: { backgroundColor: '#085041', borderRadius: 14, padding: 18, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
