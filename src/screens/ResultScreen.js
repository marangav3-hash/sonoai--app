import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/sonoai";
const GA=(days)=>days?Math.floor(days/7)+"w "+days%7+"d":"?";
const Metric=({label,value,unit,hi})=>(<View style={[s.metric,hi&&s.metricHi]}><Text style={s.metricLabel}>{label}</Text><Text style={[s.metricValue,hi&&s.metricValueHi]}>{value!=null?value:"?"}{value!=null&&unit?" "+unit:""}</Text></View>);
export default function ResultScreen({ route, navigation }) {
  const { token } = useAuth();
  const { scanId, result: init } = route.params || {};
  const [result,setResult]=useState(init||null);
  if(loading) return <View style={s.center}><ActivityIndicator size="large" color="#1D9E75" /><Text style={s.loadingText}>Waiting for AI results...</Text></View>;
  return (
    <ScrollView style={s.container}>
      {result.emergency_flag && (
        <View style={s.emergencyBar}>
          <View><Text style={s.emergencyTitle}>URGENT - Clinical review required</Text><Text style={s.emergencyReason}>{result.emergency_reason}</Text></View>
        </View>
      )}
      <View style={s.gaCard}>
        <Text style={s.gaLabel}>GESTATIONAL AGE</Text>
        <Text style={s.gaValue}>{GA(result.gestational_age_days)}</Text>
        <Text style={s.gaConf}>Confidence: {result.ga_confidence?Math.round(result.ga_confidence*100)+"%":"?"}</Text>
      </View>
      <Text style={s.sectionLabel}>FETAL BIOMETRY</Text>
      <View style={s.grid}>
        <Metric label="BPD" value={result.bpd_mm} unit="mm" hi />
        <Metric label="HC" value={result.hc_mm} unit="mm" hi />
        <Metric label="AC" value={result.ac_mm} unit="mm" />
        <Metric label="Femur" value={result.fl_mm} unit="mm" />
      </View>
      <View style={s.disclaimer}><Text style={s.disclaimerText}>SonoAI results are decision support only. All clinical decisions must be made by a qualified clinician.</Text></View>
      <TouchableOpacity style={s.newBtn} onPress={()=>navigation.navigate("Scan")}><Text style={s.newBtnText}>New scan</Text></TouchableOpacity>
    </ScrollView>
  );
}
const s=StyleSheet.create({
  container:{flex:1,backgroundColor:"#F7F7F5"},center:{flex:1,alignItems:"center",justifyContent:"center",gap:12},
  loadingText:{color:"#085041",fontSize:14},errText:{color:"#888",fontSize:14},
  emergencyBar:{backgroundColor:"#FCEBEB",borderBottomWidth:2,borderBottomColor:"#E24B4A",flexDirection:"row",padding:16,gap:12},
  emergencyIcon:{fontSize:28,color:"#791F1F",fontWeight:"700"},emergencyTitle:{fontSize:15,fontWeight:"700",color:"#791F1F"},emergencyReason:{fontSize:13,color:"#791F1F",marginTop:2},
  gaCard:{backgroundColor:"#085041",margin:16,borderRadius:16,padding:24,alignItems:"center"},
  gaLabel:{color:"#9FE1CB",fontSize:11,fontWeight:"700",letterSpacing:2,marginBottom:8},
  gaValue:{color:"#E1F5EE",fontSize:48,fontWeight:"700"},gaConf:{color:"#5DCAA5",fontSize:13,marginTop:6},
  sectionLabel:{fontSize:11,fontWeight:"700",color:"#888",letterSpacing:2,marginHorizontal:16,marginBottom:10},
  grid:{flexDirection:"row",flexWrap:"wrap",paddingHorizontal:12,gap:8,marginBottom:16},
  metric:{backgroundColor:"#fff",borderRadius:12,padding:16,width:"47%",borderWidth:1,borderColor:"#eee"},
  metricHi:{backgroundColor:"#E1F5EE",borderColor:"#5DCAA5"},metricLabel:{fontSize:11,fontWeight:"700",color:"#888",letterSpacing:1,marginBottom:6},
  metricValue:{fontSize:28,fontWeight:"700",color:"#111"},metricValueHi:{color:"#085041"},
  disclaimer:{backgroundColor:"#fff",margin:16,borderRadius:10,padding:14,borderWidth:1,borderColor:"#eee"},disclaimerText:{fontSize:12,color:"#888",lineHeight:18},
  newBtn:{backgroundColor:"#1D9E75",margin:16,borderRadius:14,padding:16,alignItems:"center",marginBottom:32},newBtnText:{color:"#fff",fontSize:15,fontWeight:"700"},
});
