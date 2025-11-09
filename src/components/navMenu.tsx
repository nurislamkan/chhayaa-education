"use client";

import { useModulesQuery } from "@data/module/use-module.query";
import { useAllModulePermissions } from "@/data/permissions/use-permissions.query";
import { getAuthCredentials } from "@/utils/auth-utils"; 
import { type Navigation } from "@toolpad/core/AppProvider";

export default function useNavigationItems(): Navigation {
  const authCredentials = getAuthCredentials();
  const groupId: number = authCredentials?.groupId ?? 0;

  const { data: modules } = useModulesQuery({
    order: ["ordering ASC"],
  });

  const allModuleIds = modules?.map((item: any) => item.id) ?? [];
 

  const permissionsResult = useAllModulePermissions(allModuleIds, groupId); 

  if (!modules || !permissionsResult?.data) return [];
 

  // const navigationItems: Navigation = modules
  //   .filter((module: any) => {
  //     return modulePermissions.some(
  //       (perm: any) => perm.moduleId === module.id && perm.actions?.length > 0
  //     );
  //   })
  //   .map((module: any) => ({
  //     title: module.name,
  //     page: { kind: "page", name: module.slug },
  //     icon: <DynamicIcon iconName={module.icon} />,
  //   }));

  return allModuleIds;
}
