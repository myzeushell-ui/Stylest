import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { WardrobeScreen } from './screens/WardrobeScreen';
import { WardrobeAnalyticsScreen } from './screens/WardrobeAnalyticsScreen';
import { BeautyScreen } from './screens/BeautyScreen';
import { FitnessScreen } from './screens/FitnessScreen';
import { ChatScreen } from './screens/ChatScreen';
import { StyleDnaSetupScreen } from './screens/StyleDnaSetupScreen';
import { StyleDnaResultsScreen } from './screens/StyleDnaResultsScreen';
import { StyleDnaInsightsScreen } from './screens/StyleDnaInsightsScreen';
import { MissingItemsScreen } from './screens/MissingItemsScreen';
import { HighImpactScreen } from './screens/HighImpactScreen';
import { BeautyDnaScreen } from './screens/BeautyDnaScreen';
import { BodyDnaScreen } from './screens/BodyDnaScreen';
import { StyleDnaHubScreen } from './screens/StyleDnaHubScreen';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomeScreen />} />
        <Route path="profile" element={<ProfileScreen />} />

        <Route path="wardrobe" element={<WardrobeScreen />} />
        <Route path="wardrobe/analytics" element={<WardrobeAnalyticsScreen />} />

        <Route path="beauty" element={<BeautyScreen />} />
        <Route path="fitness" element={<FitnessScreen />} />
        <Route path="chat" element={<ChatScreen />} />

        <Route path="styledna" element={<StyleDnaHubScreen />} />
        <Route path="styledna/setup" element={<StyleDnaSetupScreen />} />
        <Route path="styledna/results" element={<StyleDnaResultsScreen />} />
        <Route path="styledna/insights" element={<StyleDnaInsightsScreen />} />
        <Route path="styledna/missing" element={<MissingItemsScreen />} />
        <Route path="styledna/high-impact" element={<HighImpactScreen />} />
        <Route path="styledna/beauty" element={<BeautyDnaScreen />} />
        <Route path="styledna/body" element={<BodyDnaScreen />} />
      </Route>
    </Routes>
  );
}
