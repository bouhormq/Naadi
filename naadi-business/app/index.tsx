import { Redirect } from 'expo-router';
const App = () => {
  const user = false; // Or your actual user check

  if (user) {
    return <Redirect href="/(main)" />; // Assuming '/main' is another route
  }

  return (
    <>
    </>
  );
};

export default App;