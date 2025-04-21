import { Stack } from 'expo-router';
import Header from './(components)/Header';

const PartnerLayout = () => {
  return (
    <>
      <Header />
      <Stack screenOptions={{ headerShown: false }}>
      </Stack>
    </>
  );
};

export default PartnerLayout;