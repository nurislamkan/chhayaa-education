import DynamicIcon from "@components/ui/dynamic-icon";
import { useAllModulePermissions } from "@data/permissions/use-permissions.query";
import { type NavigationPageItem } from "@toolpad/core/AppProvider";
import { getAuthCredentials } from "./auth-utils";

interface Module {
  id: number;
  slug: string;
  name: string;
  icon: string;
  parentId: number | null;
  createdAt: string;
  createdBy: string;
  deleted: boolean;
  ordering: number;
  status: number;
  children?: Module[];
}

interface Permission {
  id: number;
  moduleId: number;
  groupId: number;
  actions: string[];
}

// Helper: Safely capitalize
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Helper: Resolve full path for children
const resolveChildSlug = (parentSlug: string, childSlug: string): string => {
  if (!childSlug) return "";
  if (childSlug.startsWith("admin/")) return childSlug;
  if (parentSlug && !parentSlug.endsWith("/")) return `${parentSlug}/${childSlug}`;
  return `${parentSlug}${childSlug}`;
};

// Main function
export function transformNavigation(modules: Module[]): NavigationPageItem[] {
  const authCredentials = getAuthCredentials();
  const groupId = authCredentials?.groupId ?? 0;

  if (!modules?.length) return [];

  const allModuleIds: number[] = modules.map((m) => m.id);
  const { data: permissions = [] } = useAllModulePermissions(allModuleIds, groupId);
console.log('permissions',permissions);

  // Ensure TypeScript knows this is a Set<number>
  const permittedModuleIds: Set<number> = new Set(
    (permissions as Permission[]).map((p) => p.moduleId)
  );

  // Filter only permitted modules (including children if parent is permitted)
  const filterPermitted = (mods: Module[]): Module[] =>
    mods
      .filter((mod) => !mod.deleted && mod.status === 1 && permittedModuleIds.has(mod.id))
      .map((mod) => ({
        ...mod,
        children: mod.children ? filterPermitted(mod.children) : undefined,
      }))
      .filter((mod) => !mod.children || mod.children.length > 0);

  const permittedModules = filterPermitted(modules);

  if (!permittedModules.length) return [];

  return permittedModules
    .sort((a, b) => a.ordering - b.ordering)
    .map((mod): NavigationPageItem => {
      const baseItem: NavigationPageItem = {
        kind: "page",
        segment: mod.slug || mod.name.toLowerCase().replace(/\s+/g, "-"),
        title: capitalize(mod.name),
        icon: <DynamicIcon iconName={mod.icon} fallback="MdDashboard" size={20} />,
      };

      if (mod.children?.length) {
        baseItem.children = mod.children
          .sort((a, b) => a.ordering - b.ordering)
          .map((child): NavigationPageItem => ({
            kind: "page",
            segment: resolveChildSlug(mod.slug, child.slug),
            title: capitalize(child.name),
            icon: <DynamicIcon iconName={child.icon} fallback="MdViewComfy" size={20} />,
          }));
      }

      return baseItem;
    });
}
