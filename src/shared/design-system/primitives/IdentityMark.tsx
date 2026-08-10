import React from 'react'; import { StyleSheet, View } from 'react-native'; import { Text } from './Text'; import { useDesignTokens } from '../theme/DesignTokensProvider';
/** People are circles, merchants are squircles at radius 0 — role is legible before the name is read. */
export function IdentityMark({id,name,person=false,size=44}:{id:string|number;name:string;person?:boolean;size?:number}){const t=useDesignTokens();
 // Deterministic from the id, never random: the same merchant keeps the same mark across sessions.
 const palette=[{fill:t.colors.creator,on:t.colors.onCreator},{fill:t.colors.payout,on:t.colors.onPayout},{fill:t.colors.commerce,on:t.colors.onCommerce},{fill:t.colors.success,on:'#FFFFFF'}];
 const {fill,on}=palette[[...String(id)].reduce((n,c)=>n+c.charCodeAt(0),0)%palette.length];
 const initials=name.trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()).join('');
 return <View accessibilityLabel={name} style={[s.base,{width:size,height:size,borderRadius:person?size/2:0,borderColor:t.colors.stroke,backgroundColor:fill}]}><Text variant="label" color={on}>{initials}</Text></View>}
export const Avatar=(p:Omit<React.ComponentProps<typeof IdentityMark>,'person'>)=><IdentityMark {...p} person/>; export const MerchantMark=(p:Omit<React.ComponentProps<typeof IdentityMark>,'person'>)=><IdentityMark {...p}/>; const s=StyleSheet.create({base:{borderWidth:2,alignItems:'center',justifyContent:'center'}});
