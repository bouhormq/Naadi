import { Stack } from 'expo-router';
import Header from './(components)/Header';

const PartnerLayout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false, header: () => <Header /> }}>
      </Stack>
    </>
  );
};

export default PartnerLayout;