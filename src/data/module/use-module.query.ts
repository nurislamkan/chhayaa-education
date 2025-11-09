import Modules from "@repositories/modules";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchModulesData = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.MODULES : API_ENDPOINTS.MODULES;

  // here we are enforcing the order to be "ordering ASC" for the modules
  const enforcedOptions = {
    ...options,
    order: ["ordering ASC"],
  };
  const { data } = await Modules.find(`${endpoint}?filter=${JSON.stringify(enforcedOptions)}`, localContext);
  return data;
};

const useModulesQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["modules"],
    queryFn: () => fetchModulesData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useUpdateModulesMutation = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Modules.patchUpdate(`${API_ENDPOINTS.MODULES}/${params.id}`, params);
    },
  });
};

const useCreateModulesMutation = () => {
  return useMutation({
    mutationFn: (variables: any) => {
      return Modules.create(API_ENDPOINTS.MODULES, variables);
    },
  });
};

const deleteModulesById = async (params: any) => {

  return Modules.patchUpdate(`${API_ENDPOINTS.MODULES}/${params.id}`, params.input);
};

// const useDeleteModulesMutation = (): ReturnType<typeof useMutation<number, unknown, number, unknown>> => {
  
  
//   return useMutation<number, unknown, number>({
//     mutationFn: (id: number) => {
//       console.log(id);
//       return deleteModulesById(id);
//     },
//   });
// };

const useDeleteModulesMutation = (localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.MODULES
    : API_ENDPOINTS.MODULES;

  return useMutation({
    mutationFn: (id: number) => {
      return Modules.delete(`${endpoint}/${id}`);
    },
  });
};

export {
  fetchModulesData,
  useUpdateModulesMutation,
  useModulesQuery,
  useDeleteModulesMutation,
  useCreateModulesMutation,
  deleteModulesById,
};
