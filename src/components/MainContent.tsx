import { PlayerManagement } from "./PlayerManagement";
import { FavoriteList } from "./FavoriteList";
import { Layout } from "./Layout";

const MainContent = () => {
  return (
    <Layout>
      <PlayerManagement />
      <FavoriteList />
    </Layout>
  );
};

export default MainContent;
