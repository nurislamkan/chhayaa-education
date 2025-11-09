"use client";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import { useAllModulePermissions } from "@/data/permissions/use-permissions.query";
import { getAuthCredentials } from "@/utils/auth-utils";
import DynamicIcon from "@components/ui/dynamic-icon";
import { useModulesQuery } from "@data/module/use-module.query";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 240;
const ListItemCustom = styled(ListItem)`
background-color: transparent;
padding: 8px 15px 0px;
a {
  background-color: theme.palette.primary.main;
  font-family: sans-serif;
  width:100%;
  outline: none;
  text-decoration:none;
  display:flex;
  align-items:center;
  gap:0px;
  padding: 4px 10px;
  border-radius:5px;
  font-size:14px;
  text-transform: capitalize;
  span{
    font-family: sans-serif;
    font-size:15px;
    color:#000;
  }
},
svg{
    color:#000;
    font-size:22px
  },
a:hover {
  background-color: #1565C0;
  color:#FFF;
  svg{
    color:#FFF;
  },
  span{
  color:#FFF;
  }
},
a.active {
  background-color: #1565C0;
  color:#FFF;
  svg{
    color:#FFF;
  },
  span{
  color:#FFF;
  }
},
`;
export default function SideMenu({ bgColor }: { bgColor: string }) {
  const pathname = usePathname();
  //const [accessibleMenuItems, setAccessibleMenuItems] = useState();

  const getActiveClass = (path: any) => {
    const pathSegment = path.split("/")[2];
    const currentRouteSegment = pathname.split("/")[2];

    return currentRouteSegment === pathSegment ? "active" : "";
  };

  const authCredentials = getAuthCredentials();
  const groupId: number = authCredentials?.groupId ?? 0;

  const { data: modules } = useModulesQuery({
    order: ["ordering ASC"],
  });

  const allModulIds = modules && modules.map((item: any) => item.id);

  const ModulePermissions = useAllModulePermissions(allModulIds || [], groupId);
  const { data: modulePermissions = [] } = useAllModulePermissions(allModulIds || [], groupId);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: bgColor,
          color: "#FFF",
          marginTop: "65px",
          placeContent: "space-between",
        },
      }}
    >
      <Box sx={{ overflow: "auto", padding: "20px 0px 0px" }}>
        <List>
    {modules &&
      modules.map((item: any) => {
        const isAccessible = modulePermissions.some(
          (permission: any) => permission.moduleId === item.id && permission.actions.length > 0
        );

        if (!isAccessible) return null;

        return (
          <ListItemCustom key={item.id}>
            <Link className={getActiveClass(item.slug)} href={item.slug}>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <DynamicIcon iconName={item.icon} />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </Link>
          </ListItemCustom>
        );
      })}
  </List>
      </Box>
    </Drawer>
  );
}
