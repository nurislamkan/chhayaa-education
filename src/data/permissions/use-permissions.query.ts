import Permission from "@repositories/permissions";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PermissionType } from "@/utils/generated";

export type IRegistrationVariables = PermissionType;

const fetchPermissionData = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.PERMISSIONS
    : API_ENDPOINTS.PERMISSIONS;

  const { data } = await Permission.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const usePermissionQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => fetchPermissionData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useUpdatePermissionInfo = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Permission.patchUpdate(
        `${API_ENDPOINTS.PERMISSIONS}/${params.id}`,
        params
      );
    },
  });
};

const fetchDetails = async (id: number, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.PERMISSIONS
    : API_ENDPOINTS.PERMISSIONS;
  return Permission.find(`${endpoint}/${id}`);
};

const useDetailsPerInfo = (id: number, localContext?: any) => {
  return useQuery({
    queryKey: ["permissionDetails"],
    queryFn: () => fetchDetails(id, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const getModuleByIds = async (
  moduleIds: number[],
  groupId: number,
  localContext?: any
) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.PERMISSIONS
    : API_ENDPOINTS.PERMISSIONS;

  const params = new URLSearchParams();
  moduleIds.forEach((id) => params.append("moduleIds", id.toString()));
  params.append("groupId", groupId.toString());

  const url = `${endpoint}/modules?${params.toString()}`;
  const result = await Permission.find(url, localContext);
  return result;
};

const useAllModulePermissions = (moduleIds: number[], groupId: number) => {
  return useQuery({
    queryKey: ["module_permissions", moduleIds, groupId],
    queryFn: () => getModuleByIds(moduleIds, groupId),
    enabled: moduleIds.length > 0 && groupId > 0,
    select: data => data?.data ?? [],
  });
};

 

const fetchModuleGroup = async (
  moduleId: number,
  groupId: number,
  localContext?: any
): Promise<any> => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.PERMISSIONS
    : API_ENDPOINTS.PERMISSIONS;   
   
  return Permission.find(`${endpoint}/checkpermission/${moduleId}/${groupId}`);
};
const useCheckPermissions = (
  moduleId: number,
  groupId: number, 
) => {
  
  const { data } = useQuery({
    queryKey: ["module_group"],
    queryFn: () => fetchModuleGroup(moduleId, groupId),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  }); 

  return data ? data : null;
};

const useCreatePermissionMutation = () => {
  return useMutation({
    mutationFn: (variables: IRegistrationVariables) => {
      return Permission.create(API_ENDPOINTS.PERMISSIONS, variables);
    },
  });
};

const useDelete = (localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.PERMISSIONS
    : API_ENDPOINTS.PERMISSIONS;

  return useMutation({
    mutationFn: (id: number) => {
      return Permission.delete(`${endpoint}/${id}`);
    },
  });
};

const modulePermitted = async (id: number, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.PERMISSIONS
    : API_ENDPOINTS.PERMISSIONS;
  return Permission.find(`${endpoint}/module/${id}`);
};

const useIsModulePermission = (id: number, localContext?: any) => {
  return useQuery({
    queryKey: ["permission"],
    queryFn: () => modulePermitted(id, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
export {
  fetchPermissionData,
  useDetailsPerInfo,
  useUpdatePermissionInfo,
  usePermissionQuery,
  useDelete,
  useCreatePermissionMutation,
  useAllModulePermissions,
  useIsModulePermission,
  getModuleByIds,
  useCheckPermissions,
};
