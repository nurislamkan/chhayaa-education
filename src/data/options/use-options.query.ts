import Options from "@repositories/options";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import User from "@repositories/user";
import Product from "@repositories/product";
import Category from "@repositories/category";
import { ROLES } from "@/utils/constants";
import Groups from "@repositories/groups";

const fetchOptionsData = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.OPTIONS
    : API_ENDPOINTS.OPTIONS;

  const { data } = await Options.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const useGetOptionsQuery = (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.OPTIONS
    : API_ENDPOINTS.OPTIONS;

  return useQuery({
    queryKey: ["options"],
    queryFn: async () => {
      const { data } = await Options.find(
        `${endpoint}?filter=${JSON.stringify(options)}`,
        localContext
      );
      return data;
    },
  });
};

const useUpdateOptionsMutation = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Options.patchUpdate(`${API_ENDPOINTS.OPTIONS}`, params);
    },
  });
};

const useCreateOptionsMutation = () => {
  return useMutation({
    mutationFn: (variables: any) => {
      return Options.create(API_ENDPOINTS.OPTIONS, variables);
    },
  });
};

export const useSaveOptionsMutation = () => {
  return useMutation({
    mutationFn: async (formData: Record<string, string | File | null>) => {
      Object.entries(formData).forEach(([key, value]) => {
        const variables = {
          option_name: key,
          option_value:
            value instanceof File ? value.name : (value ?? undefined),
        };
        Options.create(API_ENDPOINTS.OPTIONS, variables);
        //variables.append(key, value ?? "");
      });

      return true;
    },
  });
};

const deleteExpenseById = async (id: number) => {
  const updateDelete = { deleted: true };
  const { data } = await Options.patchUpdate(
    `${API_ENDPOINTS.OPTIONS}/${id}`,
    updateDelete
  );
  return data;
};

const groupWithCount = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.GROUPS_COUNT
    : API_ENDPOINTS.GROUPS_COUNT;

  const { data } = await Groups.find(
    `${endpoint}?where=${encodeURI(JSON.stringify(options))}`,
    localContext
  );
  return data;
};
const userWithCount = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.USER_COUNT
    : API_ENDPOINTS.USER_COUNT;

  const { data } = await User.find(
    `${endpoint}?where=${encodeURI(JSON.stringify(options))}`,
    localContext
  );
  return data;
};

export const productWithCount = async (
  options: Record<string, any>,
  localContext = false
): Promise<number> => {
  try {
    const endpoint = localContext
      ? LOCAL_ENDPOINTS.PRODUCTS
      : API_ENDPOINTS.PRODUCTS; 
    const response = await Product.find(
      `${endpoint}?where=${encodeURIComponent(JSON.stringify(options))}`,
      localContext
    );

    // ✅ Count products from the response
    if (Array.isArray(response?.data)) {
      return response.data.length;
    }

    // Optional fallback in case of unexpected shape
    if (Array.isArray(response)) {
      return response.length;
    }

    return 0;
  } catch (error) {
    console.error("Error fetching product count:", error);
    return 0;
  }
};

export const categoryWithCount = async (
  options: Record<string, any>,
  localContext = false
): Promise<number> => {
  try {
    const endpoint = localContext
      ? LOCAL_ENDPOINTS.PRODUCTS
      : API_ENDPOINTS.PRODUCTS;

    const response = await Category.find(
      `${endpoint}?where=${encodeURIComponent(JSON.stringify(options))}`,
      localContext
    );

    // ✅ Count products from the response
    if (Array.isArray(response?.data)) {
      return response.data.length;
    }

    // Optional fallback in case of unexpected shape
    if (Array.isArray(response)) {
      return response.length;
    }

    return 0;
  } catch (error) {
    console.error("Error fetching product count:", error);
    return 0;
  }
};

const useDashboardStats = (localContext?: any) => {
  const fetchData = async () => {
    return {
      usersTotal: await userWithCount(
        { status: "active", deleted: 0 },
        localContext
      ),
      accountTotal: await userWithCount(
        { status: "active", role: ROLES.ACCOUNT, deleted: 0 },
        localContext
      ),
      vendorTotal: await userWithCount(
        { status: "active", role: ROLES.VENDOR, deleted: 0 },
        localContext
      ),
      adminTotal: await userWithCount(
        { status: "active", role: ROLES.ADMIN, deleted: 0 },
        localContext
      ),
      totalProduct: await productWithCount(
        { status: "active", role: ROLES.ADMIN, deleted: 0 },
        localContext
      ),
      totalCategory: await productWithCount(
        { status: "active", role: ROLES.ADMIN, deleted: 0 },
        localContext
      ),
      userRole: ROLES.ADMIN,
      groupTotal: await groupWithCount({ status: 1, deleted: 0 }, localContext),
    };
  };

  return useQuery<any, Error>({
    queryKey: ["allSummaryRecords"],
    queryFn: () => fetchData(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export {
  fetchOptionsData,
  useUpdateOptionsMutation,
  useGetOptionsQuery,
  deleteExpenseById,
  useCreateOptionsMutation,
  useDashboardStats,
};
