import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/sonoai";
export default function HistoryScreen({ navigation }) {
  const { token } = useAuth();
  const [scans,setScans]=useState([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const load=async()=>{ try{setScans(await api.listScans(token));}catch(e){console.error(e);}finally{setLoading(false);setRefreshing(false);} };
  useEffect(()=>{load();},[]);
  const color=(st)=>st==="done"?"#1D9E75":st==="error"?"#E24B4A":"#EF9F27";
  const lbl=(st)=>st==="done"?"Complete":st==="error"?"Error":"Processing";
  if(loading) return <View style={s.center}><ActivityIndicator size="large" color="#1D9E75" /></View>;
  return (
    <FlatList style={s.container} data={scans} keyExtractor={i=>i.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}} tintColor="#1D9E75" />}
      ListEmptyComponent={<View style={s.empty}><Text style={s.emptyText}>No scans yet.</Text><Text style={s.emptySub}>Upload a DICOM file to get started.</Text></View>}
      renderItem={({item:sc})=>(
        <TouchableOpacity style={s.row} onPress={()=>navigation.navigate("Result",{scanId:sc.id})}>
          <View style={[s.badge,{backgroundColor:color(sc.status)+"20"}]}><View style={[s.dot,{backgroundColor:color(sc.status)}]}/><Text style={[s.badgeText,{color:color(sc.status)}]}>{lbl(sc.status)}</Text></View>
          <View style={{flex:1}}><Text style={s.mode}>{sc.scan_mode} - {sc.indication}</Text><Text style={s.time}>{new Date(sc.created_at).toLocaleString()}</Text></View>
          {sc.emergency_flag&&<View style={s.urgent}><Text style={s.urgentText}>URGENT</Text></View>}
          <Text style={s.chevron}>{'>'}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
const s=StyleSheet.create({
  container:{flex:1,backgroundColor:"#F7F7F5"},center:{flex:1,alignItems:"center",justifyContent:"center"},
  empty:{alignItems:"center",paddingTop:80,gap:8},emptyText:{fontSize:16,fontWeight:"600",color:"#555"},emptySub:{fontSize:13,color:"#888"},
  row:{backgroundColor:"#fff",marginHorizontal:16,marginTop:10,borderRadius:12,padding:14,flexDirection:"row",alignItems:"center",gap:10,borderWidth:1,borderColor:"#eee"},
  badge:{flexDirection:"row",alignItems:"center",gap:5,paddingHorizontal:8,paddingVertical:4,borderRadius:999},
  dot:{width:6,height:6,borderRadius:3},badgeText:{fontSize:11,fontWeight:"700"},
  mode:{fontSize:14,fontWeight:"600",color:"#111"},time:{fontSize:12,color:"#888",marginTop:2},
  urgent:{backgroundColor:"#FCEBEB",borderRadius:6,paddingHorizontal:8,paddingVertical:3},urgentText:{color:"#791F1F",fontSize:11,fontWeight:"700"},
  chevron:{color:"#ccc",fontSize:20},
});
