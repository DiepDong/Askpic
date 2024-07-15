import { Outlet, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/AppLayout";
import {
  IconHome,
  IconHomeFilled,
  IconReportSearch,
  IconSettings,
  IconSettingsFilled,
} from "@tabler/icons-react";

export default function DashboardPageLayout() {
  const navigate = useNavigate();
  const navbarItems = [
    {
      label: "Home",
      icon: <IconHome size="1rem" />,
      activeIcon: <IconHomeFilled size="1rem" />,
      action: () => navigate("/dashboard"),
      to: "/dashboard",
    },
    {
      label: "Search Document",
      icon: <IconReportSearch size="1rem" />,
      activeIcon: <IconReportSearch size="1rem" />,
      action: () => navigate("/dashboard/search"),
      to: "/dashboard/search",
    },
  ];

  const navbarSettings = [
    {
      label: "Setting",
      icon: <IconSettings size="1rem" />,
      activeIcon: <IconSettingsFilled size="1rem" />,
      to: "/dashboard/setting",
    },
  ];

  return (
    <Layout navItems={navbarItems} navPostItems={navbarSettings}>
      <Outlet />
    </Layout>
  );
}
