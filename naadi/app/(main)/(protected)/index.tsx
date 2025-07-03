import { Redirect } from 'expo-router';

export default function MainProtectedIndex() {
  return <Redirect href="/(main)/(protected)/(tabs)/" />;
}