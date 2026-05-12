import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
export default function LoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    const ok = await login(email.trim(), password);
    ok ? navigation.replace("Dashboard") : Alert.alert("Login failed", "Incorrect email or password.");
  };
  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={s.inner}>
        <View style={s.logoBox}>
          <View style={s.iconCircle}><Text style={s.pulse}>~ AI ~</Text></View>
          <Text style={s.logo}>Sono<Text style={s.ai}>AI</Text></Text>
          <Text style={s.tagline}>ULTRASOUND INTELLIGENCE</Text>
        </View>
        <View style={s.form}>
          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="sonographer@hospital.ke" placeholderTextColor="#5DCAA5" />
          <Text style={s.label}>Password</Text>
          <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="........" placeholderTextColor="#5DCAA5" />
          <TouchableOpacity style={[s.btn, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Sign in</Text>}
          </TouchableOpacity>
        </View>
        <Text style={s.footer}>SonoAI v1.0  -  For authorised clinical use only</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#085041" },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  logoBox: { alignItems: "center", marginBottom: 48 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#1D9E75", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  pulse: { color: "#E1F5EE", fontSize: 16 },
  logo: { fontSize: 42, fontWeight: "700", color: "#E1F5EE" },
  ai: { color: "#5DCAA5", fontWeight: "300" },
  tagline: { fontSize: 11, color: "#5DCAA5", letterSpacing: 3, marginTop: 4 },
  form: { backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 },
  label: { color: "#9FE1CB", fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: "#E1F5EE", fontSize: 15, borderWidth: 1, borderColor: "#1D9E75" },
  btn: { backgroundColor: "#1D9E75", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 24 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: { color: "#5DCAA5", fontSize: 11, textAlign: "center", marginTop: 32, opacity: 0.7 },
});
